# This file is for managing loan-related functionality
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework.parsers import JSONParser
from rest_framework.serializers import ValidationError
from rest_framework import status

from Matostheque.serializers import LoanSerializer
from Matostheque.serializers import MaterialSerializer
from .materials_controller import get_material, get_events_detail_lite
from .emails_controller import *

from django.http.response import JsonResponse
from dateutil.parser import parse


def on_create_loan(request):
    """
    Function to create a new loan record.
    """
    try:
        # Serializing the data passed through the request
        data = request.data
        material = get_material(data['material'])
        
        # remove the quantity if the quantity is empty
        if data.get("loan_quantity") == "":
            del data["loan_quantity"]
            
        # Select a type depending on the type of the material
        if material.type == "CONSUMABLES":
            data["type"] = "Donation"
        else:
            data["type"] = "Loan"
            
        # Select the status of the loan
        if material.validation:
            data["loan_status"]  = 'Pending Validation'
        elif data.get('loan_date') != timezone.now().date().strftime('%Y-%m-%d'):
            data["loan_status"]  = 'Booked'
            data["approval_date"] = timezone.now()
        else:
            data["loan_status"]  = 'Borrowed'
            data["approval_date"] = timezone.now()
            
        loan_serializer = LoanSerializer(data=data)
        
        # Validating the tentative loan
        if loan_serializer.is_valid():
            
            # FIX 1: Verify quantity BEFORE checking validation status
            if data.get('type') == 'Donation':
                requested_qty = float(data.get('loan_quantity', 1))
                
                # Check if requested exceeds available
                if int(material.quantity_available) < int(requested_qty):
                    # Raising ValueError ensures a clean string is sent to the frontend
                    raise ValueError(f"Requested quantity ({int(requested_qty)}) exceeds available amount ({int(material.quantity_available)}).")
                
                # Deduct inventory immediately if not pending validation
                if data.get('loan_status') != 'Pending Validation':
                    new_material = {'quantity_available': material.quantity_available - requested_qty}
                    
                    # FIX 2: If inventory hits 0, it should not be available for loan
                    if new_material['quantity_available'] == 0:
                        new_material['available_for_loan'] = False 
                        
                    material_serializer = MaterialSerializer(material, data=new_material, partial=True)
                    
                    if material_serializer.is_valid():
                        loan = loan_serializer.save()
                        material_serializer.save()
                    else:
                        raise ValueError("Invalid material data update.")
                else:
                    # If it is pending validation, just save without deducting yet
                    loan = loan_serializer.save()
            else:
                loan = loan_serializer.save()
            
            # --- ENABLED EMAIL LOGIC ---
            # Sending a validation email to owner if material needs validation
            # if material.validation:
            #     send_validation_email(loan)
            # ---------------------------
                
            # FIX 3: Properly return the success response instead of falling through to the error handler
            # (Uncommented and activated the success return)
            return JsonResponse(loan_serializer.data, status=status.HTTP_201_CREATED)
            
        else:
            # FIX 4: Format dictionary errors into a readable string to avoid "undefined : undefined" on frontend
            errors = loan_serializer.errors
            first_field = next(iter(errors))
            first_error = errors[first_field][0]
            error_string = f"{first_field.replace('_', ' ').capitalize()}: {first_error}"
            raise ValueError(error_string)

    except Exception as e:
        # Re-raise so the view can catch it and wrap it in {'message': str(e)}
        raise e


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
    new_loan_data = {}
    #if the loan has not begun, or it is the first day you can modify the quantity and the location as the borrower
    if initial_data.data['loan_status'] in  ['Booked','Pending Validation'] or (initial_data.data['loan_status'] == 'Borrowed' and initial_data.data['loan_date'] == timezone.now().date().strftime('%Y-%m-%d')):
        if initial_data.data['borrower'] == request.user.user_id:
            new_loan_data = {'loan_quantity': loan_data['loan_quantity'],
                                    'location': loan_data['location']}
            if (initial_data['loan_quantity'].value + material_data['quantity_available']) < float(loan_data['loan_quantity']):
                raise Exception("'A donation quantity cannot be greater than the material quantity available")
            elif (initial_data['loan_quantity'].value + material_data['quantity_available']) == float(loan_data['loan_quantity']):
                material.quantity_available = 0
                material.available_for_loan = False
            else:
                if material.quantity_available == 0:
                    material.quantity_available =  (initial_data['loan_quantity'].value + material_data['quantity_available'])-float(loan_data['loan_quantity'])
                    material.available_for_loan = True
                else:
                    material.quantity_available =  (initial_data['loan_quantity'].value + material_data['quantity_available'])-float(loan_data['loan_quantity'])
    # if the loan is not finish and you are the ownr of the material you can modifie the duration
    #TODO add modification of the start date
    elif initial_data.data['loan_status'] in ['Booked','Pending Validation','Borrowed','Overdue'] :
        if material_data["user"] == request.user.user_id:
            new_loan_data = {'duration': loan_data['duration']}
    try:
        
        # Serialize/ Merge the loan instance and the data passed through the request
        loan_serializer = LoanSerializer(loan, data=new_loan_data, partial=True)

        # Validating the tentative loan
        if loan_serializer.is_valid():
            saved_instance = loan_serializer.save() #save instance
            material.save()
            # Return updated record
            return JsonResponse(loan_serializer.data)
        
        # Return an error message if the seriliazed - updated - instance is not valid
        raise Exception(loan_serializer.errors)
    
    except Exception as e:
        print("Error in updating loan record!", e, "!")
        raise e

def on_cancel_loan(loan, request):
    """
    Function to change the status to cancel of an existing loan record.

    Args:
        loan (obj): The loan instance to be updated.
        request (obj): The related data to update in the loan instance
    """
    try:
        initial_data = LoanSerializer(loan)
        material = get_material(pk=initial_data.data['material'])
        # if the loan has not begun the borrower can cancel it
        if initial_data.data.get('loan_status') in ['Booked','Pending Validation']:
            if initial_data.data['borrower'] != request.user.user_id:
                raise Exception('User cannot cancel this loan!')
        else:
            raise Exception('This loan can not be canceled!')
        # Serialize the loan instance and the data passed through the request
        new_loan_data = {"loan_status": "Canceled",
                                "latest_change_status_date": timezone.now(), }
        loan_serializer = LoanSerializer(loan, data=new_loan_data, partial=True)

        # Validating the tentative loan

        # Validating the tentative loan
        if loan_serializer.is_valid():
            # if it is a donation add back the quantity to the material
            if initial_data.data.get('type') == 'Donation' and initial_data.data.get('loan_status') == 'Booked':
                new_material = {'quantity_available' : material.quantity_available + float(initial_data.data['loan_quantity'])}
                # and id the quantity was at 0 set the availability to true
                if material.quantity_available == 0:
                    new_material['available_for_loan'] = True
                material_serializer = MaterialSerializer(material,data=new_material,partial=True)
                # id the fields of the material are fined sve everything
                if material_serializer.is_valid():
                    loan_serializer.save()
                    material_serializer.save()
                else:
                    raise Exception(material_serializer.errors)
            else:
                loan_serializer.save()
        else:
            raise Exception(loan_serializer.errors)

    except Exception as e:
        raise e

def on_approve_loan(loan, request):
    """
    Function to change the status to approve of an existing loan record.

    Args:
        loan (obj): The loan instance to be updated.
        request (obj): The related data to update in the loan instance
    """
    try:
        initial_data = LoanSerializer(loan)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data
        # if the loan is status is Pending Validation and you are the owner of the material you can approve the loan
        if initial_data.data.get('loan_status') == 'Pending Validation':
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot approve this loan!')
        else:
            raise Exception('This loan can not be approved!')
        if initial_data['loan_date'].value == timezone.now().date().strftime('%Y-%m-%d'):
            new_loan_data = {"loan_status": "Borrowed",
                                    "approval_date": timezone.now()}
        else:
            new_loan_data = {"loan_status": "Booked",
                                    "approval_date": timezone.now()}
        # Serialize/ Merge the loan instance and the data passed through the request
        loan_serializer = LoanSerializer(loan, data=new_loan_data, partial=True)


        # Validating the tentative loan
        if loan_serializer.is_valid():
            # remove the quantity donated to the material
            if initial_data.data.get('type') == 'Donation':
                new_material = {'quantity_available' : material.quantity_available - float(initial_data.data['loan_quantity'])}
                if material.quantity_available < 0:
                    raise Exception('You do not have enough materials to accept this loan')
                elif material.quantity_available == 0:
                    new_material['available_for_loan'] = False
                material_serializer = MaterialSerializer(material,data=new_material,partial=True)
                if material_serializer.is_valid():
                    loan_serializer.save()
                    material_serializer.save()
                else:
                    raise Exception(material_serializer.errors)
            else:
                loan_serializer.save()
        else:
            raise Exception(loan_serializer.errors)
    except Exception as e:
        raise e


def on_reject_loan(loan, request):
    """
    Function to change the status to rejected of an existing loan record.

    Args:
        loan (obj): The loan instance to be updated.
        request (obj): The related data to update in the loan instance
    """
    try:
        initial_data = LoanSerializer(loan)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data
        # if the loan is status is Pending Validation and you are the owner of the material you can reject the loan
        if initial_data.data.get('loan_status') == 'Pending Validation':
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot reject this loan!')
        else:
            raise Exception('This loan can not be rejected!')
        new_loan_data = {"loan_status": "Rejected",
                                "latest_change_status_date": timezone.now(), }
        # Serialize/ Merge the loan instance and the data passed through the request
        loan_serializer = LoanSerializer(loan, data=new_loan_data, partial=True)

        # Validating the tentative loan
        if loan_serializer.is_valid():
            loan_serializer.save()  # save instance

    except Exception as e:
        raise e

def on_close_loan(loan, request):
    """
    Function to change the status of an existing loan record.

    Args:
        loan (obj): The loan instance to be updated.
        request (obj): The related data to update in the loan instance
    """
    try:
        initial_data = LoanSerializer(loan)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data

        # if the loan active and you are the owner of the material you can close the loan
        if initial_data.data.get('loan_status') == 'Borrowed' or initial_data.data.get('loan_status') == 'Overdue' :
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot close this loan!')
        else:
            raise Exception('This loan can not be Closed!')
        new_loan_data = {"loan_status": "Closed",
                                "latest_change_status_date": timezone.now(), }
        # Serialize/ Merge the loan instance and the data passed through the request
        loan_serializer = LoanSerializer(loan, data=new_loan_data, partial=True)

        # Validating the tentative loan
        if loan_serializer.is_valid():
            loan_serializer.save()  # save instance

    except Exception as e:
        raise e

def on_delete_loan(loan):
    """
    Function to delete an existing loan record.

    Args:
        loan (obj): The loan instance to be deleted.

    Returns:
        json: returns a message with the appropriate http status.
    """
    
    try:
        
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
        owner = material.user
        
        # Selecting the needed fields instead of sending the whole record
        # data protecting purpose
        loan_data['material_details'] = {
            'title' : material.material_title,
            'images' : material.images,
            'origin' : material.origin,
            'duration' : material.loan_duration,
            'quantity_available': material.quantity_available
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

def check_if_should_be_returned(loan):
    """
    Function to modify the status if an equipment is due tomorrow or if it's overdue or if the loan begin today.
    Args:
        loan (obj): A loan instance to check.
    """
    # if the start date is today we change the status
    if loan.loan_date == datetime.now().date():
        if loan.loan_status =='Pending Validation':
            loan.loan_status = 'Rejected'
        elif loan.loan_status =='Booked':
            loan.loan_status = 'Borrowed'
    if loan.type == 'Loan' and  loan.loan_status == 'Borrowed':
        # If the end date is tomorow we send a reminder mail
        if (loan.loan_date + timedelta(days=loan.duration - 1)) == (datetime.now().date() + timedelta(days=1)) :
            send_reminder_email(loan)

        elif  (loan.loan_date + timedelta(days=loan.duration)) == datetime.now().date() :
            loan.loan_status = 'Overdue'
    print(loan.loan_status)
    loan.save()