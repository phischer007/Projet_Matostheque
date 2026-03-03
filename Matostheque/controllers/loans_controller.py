# This file is for managing loan-related functionality 
from datetime import datetime, timedelta

from rest_framework.parsers import JSONParser 
from rest_framework.serializers import ValidationError
from rest_framework import status

from Matostheque.serializers import LoanSerializer
from Matostheque.serializers import MaterialSerializer
from .materials_controller import get_material, get_events_detail_lite
from .emails_controller import *

from django.http.response import JsonResponse
from dateutil.parser import parse

def parse_date(date):
    """
    Function to parse a string to a date format.

    Args:
        date (str): The date in string format.

    Returns:
        datetime.datetime: The parsed date in datetime format.
    """
    try: 
        start = parse(date)
    except ValueError:
        print("Error trying to parse date in new loan!")
        return JsonResponse({'message': 'Error trying to parse date!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return start

def check_date_validity(data):
    """
    Function to check if a loan interval (between loan_date and the end of the loan) is valid or not.

    Args:
        data (obj): Data related to the loan.

    Returns:
        boolean: False if the equipment is booked or borrowed in between the interval, else returns true.
    """
    # Status to be checked
    STATUS_OPTIONS = ['Borrowed', 'Booked', 'Overdue']
    
    if 'loan_date' in data and 'duration' in data:
        
        # Parsing the current loan start date and end date
        start = parse_date(data.get('loan_date'))
        end = start + timedelta(days=(data.get('duration') - 1))
        
        # Getting all the loans related to the equipment
        loans = get_events_detail_lite(data.get('material'))
        
        if loans is not None:
            
            # For each loan which status is included in STATUS_OPTIONS, compare the current loan date with the looped loan date
            for loan in loans:
                if loan['loan_status'] in STATUS_OPTIONS : 
                    loan_start = parse_date(loan['loan_date'])
                    loan_end = loan_start + timedelta(days=(loan['duration'] - 1))
                    
                    # return False if the dates overlap
                    if (start <= loan_start <= end) or (start <= loan_end <= end) or (loan_start <= start <= loan_end) or (loan_start <= end <= loan_end):
                        return False
        # The date didn't overlap
        return True

def on_create_loan(request):
    """
    Function to create a new loan record.

    Args:
        request (obj): Data related to the loan.

    Returns:
        json: returns the newly saved record or an error message with the appropriate http status.
    """
    # Serializing the data passed through the request
    data = request.data
    loan_serializer = LoanSerializer(data=data)
    
    # Validating the serialized data
    if loan_serializer.is_valid():
        
        # Serializing related material data
        material = get_material(data.get('material')) 
        material_data = MaterialSerializer(material).data
        
        # Checking if the material is available
        if not check_date_validity(data):
            return JsonResponse({'message': 'Material not available during that period!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Checking if the precised duration doesn't exceed the allowed time allocation
        if material_data['loan_duration'] < data.get('duration') :
            return JsonResponse({'message': 'Loan duration exceed allowed time allocation!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            loan = loan_serializer.save() # saving the instance created to the database
            
            # Sending a validation email to owner if material needs validation, and if the borrower is not the owner of the material
            if(material.validation and loan.borrower != loan.material.owner.user):
                send_validation_email(loan)
            
            # Return the newly saved instance
            return JsonResponse(loan_serializer.data, status=status.HTTP_201_CREATED) 
        except Exception as e:
            print("Exception in create loan")
            print(e)
            
            # Catching any error during the saving process
            return JsonResponse({'message': 'Error occurred while creating the loan.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # Return an error when the serialized data is not valid
    return JsonResponse(loan_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def on_update_loan(loan, request):
    """
    Function to update an existing loan record.

    Args:
        loan (obj): The loan instance to be updated.
        request (obj): The related data to update in the loan instance

    Returns:
        json: returns the updated record or an error message with the appropriate http status.
    """
    
    # Serialize the loan record
    loan_data = JSONParser().parse(request) 
    initial_data = LoanSerializer(loan)
    
    # Serialize the related material record
    material = get_material(pk = initial_data.data['material']) 
    material_data = MaterialSerializer(material).data
    
    try:
        
        # If the duration of the loan is to be updated, check if it respects the allowed time allocation
        if('duration' in loan_data and material_data['loan_duration'] < loan_data['duration']):
            return JsonResponse({'message': 'Loan duration cannot exceed allowed time allocation!}'}, status=status.HTTP_204_NO_CONTENT)
        
        # Serialize/ Merge the loan instance and the data passed through the request
        loan_serializer = LoanSerializer(loan, data=loan_data, partial=True)
        
        # Validating the tentative loan
        if loan_serializer.is_valid(): 
            saved_instance = loan_serializer.save() #save instance
            
            # Send an email to borrower if the loan was approved - the request data contained approval_date
            if initial_data.data['approval_date'] is None and saved_instance.approval_date is not None :
                send_approved_email(loan)
            
            # Send an email to the owner if the loan was returned - the request data contained return_date
            if initial_data.data['return_date'] is None and saved_instance.return_date is not None : 
                if saved_instance.material.owner.user != saved_instance.borrower : 
                    send_returned_email(loan)
            
            # Return updated record
            return JsonResponse(loan_serializer.data)
        
        # Return an error message if the seriliazed - updated - instance is not valid
        return JsonResponse({'message': 'Loan Serializer not valid!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        print("Error in updating loan record!", e, "!")
        return JsonResponse({'message': 'Please verify your data!'}, status=status.HTTP_400_BAD_REQUEST) 

def on_delete_loan(loan):
    """
    Function to delete an existing loan record.

    Args:
        loan (obj): The loan instance to be deleted.

    Returns:
        json: returns a message with the appropriate http status.
    """
    
    try:
        # Update the related equipment availability on delete
        loan.material.update_availability()
        
        loan.delete() # delete instance 
        return JsonResponse({'message': 'Deleted!'}, status=status.HTTP_200_OK) 
    
    except Exception as e:
        print("Error in loan delete function!!")
        # Catching any error during deletion
        return JsonResponse({'message': 'Error!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    

def compare_dates(loan):
    """
    Function to check wether an actual date is bigger (exceeds) the end of a loan date.

    Args:
        loan (obj): The loan instance to make the comparison to.

    Returns:
        boolean: returns true if the loan is still active and the end date has already passed, else false
    """
    actual_date = datetime.now().date()
    loan_date = datetime.strptime(loan['loan_date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()

    if loan['duration'] and loan['duration'] < (actual_date - loan_date).days and loan['is_active']==True:
        return True
    return False

def get_detailed_loans(loans):
    """
    Function to get a detailed list of related information to a list of loans.

    Args:
        loans (list of obj): A list of loan instances.

    Returns:
        detailed_loans: list of detailed information
    """
    detailed_loans = []
    for loan in loans:
        loan_data = LoanSerializer(loan).data
        material = loan.material
        borrower = loan.borrower
        owner = material.owner.user
        
        # Selecting the needed fields instead of sending the whole record
        # data protecting purpose
        loan_data['material_details'] = {
            'title' : material.material_title,
            'team' : material.team,
            'images' : material.images,
            'origin' : material.origin,
            'duration' : material.loan_duration
        }
        
        if borrower is not None :
            loan_data['borrower_details'] = {
                'user_id' : borrower.user_id, 
                'first_name' : borrower.first_name,
                'last_name' : borrower.last_name,
                'email' : borrower.email
            }
            
        if owner is not None:
            loan_data['owner_details'] = {
                'user_id' : owner.user_id,
                'first_name' : owner.first_name,
                'last_name' : owner.last_name,
                'email' : owner.email
            }
            
        detailed_loans.append(loan_data)
    return detailed_loans

def check_if_should_be_returned(loan, email_count):
    """
    Function to check if an equipment is due tomorrow.
    Args:
        loan (obj): A loan instance to check.

    Returns:
        boolean: return True if the due date is tomorrow, else false.
    """
    loan_end = loan.loan_date + timedelta(days=(loan.duration - 1))
    tomorrow_date = datetime.now().date() + timedelta(days=1)

    if not loan.email_sent and tomorrow_date == loan_end.date():
        # Sending a reminder to the borrower if the loan end date is tomorrow
        if email_count['count'] < 50:  # Threshold: flooring the emails to a maximum of 50 per check 
            send_reminder_email(loan)
            print("Sending reminder email. Date:")
            print(datetime.now())
            loan.email_sent = True
            loan.save()
            email_count['count'] += 1
        else:
            print("Email threshold reached. Skipping further emails.")