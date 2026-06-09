# This file is for managing transaction-related functionality
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework.parsers import JSONParser
from rest_framework.serializers import ValidationError
from rest_framework import status

from Matostheque.serializers import TransactionSerializer
from Matostheque.serializers import MaterialSerializer
from .materials_controller import get_material, get_events_detail_lite
from .emails_controller import *

from django.http.response import JsonResponse
from dateutil.parser import parse


def on_create_transaction(request):
    """
    Function to create a new transaction record.

    Args:
        request (obj): Data related to the transaction.

    Returns:
        json: returns the newly saved record or an error message with the appropriate http status.
    """
    try:
        # Serializing the data passed through the request
        data = request.data
        # Serializing related material data
        material = get_material(data['material'])
        # remove the quantity if the quantity is empty
        if data.get("transaction_quantity") == "":
            del data["transaction_quantity"]
        # Select a type depending on the type of the material
        if material.type == "CONSUMABLES":
            data["type"] = "Donation"
        else:
            data["type"] = "Loan"
        # Select the status of the transaction
        if material.validation:
            data["transaction_status"]  = 'Pending Validation'
        elif data['transaction_date'] != timezone.now().date().strftime('%Y-%m-%d'):
            data["transaction_status"]  = 'Booked'
            data["approval_date"] = timezone.now()
        else:
            data["transaction_status"]  = 'Borrowed'
            data["approval_date"] = timezone.now()
        transaction_serializer = TransactionSerializer(data=data)
        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            # remove the quantity donated to the material
            if data.get('type') == 'Donation' and data.get('transaction_status') != 'Pending Validation':
                if material.quantity_available >= float(data['transaction_quantity']):
                    new_material = {'quantity_available' : material.quantity_available - float(data['transaction_quantity'])}
                    # remove the material availability if it has 0 quantity
                    if material.quantity_available == 0:
                        new_material['available_for_transaction'] = True
                    material_serializer = MaterialSerializer(material,data=new_material,partial=True)
                    # check if the material field are valid
                    if material_serializer.is_valid():
                        transaction = transaction_serializer.save()
                        material_serializer.save()
                    else:
                        raise Exception(material_serializer.errors)
                else:
                    raise Exception("'A donation quantity cannot be greater than the material quantity available")
            else:
                transaction = transaction_serializer.save()
        else:
            raise Exception(transaction_serializer.errors)

        # Sending a validation email to owner if material needs validation
        if material.validation:
            send_validation_email(transaction)
        # Return the newly saved instance
        return JsonResponse(transaction_serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Catching any error during the saving process
        raise e
        
    # Return an error when the serialized data is not valid
    return JsonResponse(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def on_update_transaction(transaction, request):
    """
    Function to update an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be updated.
        request (obj): The related data to update in the transaction instance

    Returns:
        json: returns the updated record or an error message with the appropriate http status.
    """

    # Serialize the transaction record
    transaction_data = JSONParser().parse(request)
    initial_data = TransactionSerializer(transaction)

    # Serialize the related material record
    material = get_material(pk = initial_data.data['material']) 
    material_data = MaterialSerializer(material).data
    new_transaction_data = {}
    #if the loan has not begun, or it is the first day you can modify the quantity and the location as the borrower
    if initial_data.data['transaction_status'] in  ['Booked','Pending Validation'] or (initial_data.data['transaction_status'] == 'Borrowed' and initial_data.data['transaction_date'] == timezone.now().date().strftime('%Y-%m-%d')):
        if initial_data.data['borrower'] == request.user.user_id:
            new_transaction_data = {'transaction_quantity': transaction_data['transaction_quantity'],
                                    'location': transaction_data['location']}
            if (initial_data['transaction_quantity'].value + material_data['quantity_available']) < float(transaction_data['transaction_quantity']):
                raise Exception("'A donation quantity cannot be greater than the material quantity available")
            elif (initial_data['transaction_quantity'].value + material_data['quantity_available']) == float(transaction_data['transaction_quantity']):
                material.quantity_available = 0
                material.available_for_transaction = False
            else:
                if material.quantity_available == 0:
                    material.quantity_available =  (initial_data['transaction_quantity'].value + material_data['quantity_available'])-float(transaction_data['transaction_quantity'])
                    material.available_for_transaction = True
                else:
                    material.quantity_available =  (initial_data['transaction_quantity'].value + material_data['quantity_available'])-float(transaction_data['transaction_quantity'])
    # if the loan is not finish and you are the ownr of the material you can modifie the duration
    #TODO add modification of the start date
    elif initial_data.data['transaction_status'] in ['Booked','Pending Validation','Borrowed','Overdue'] :
        if material_data["user"] == request.user.user_id:
            new_transaction_data = {'duration': transaction_data['duration']}
    try:
        
        # Serialize/ Merge the transaction instance and the data passed through the request
        transaction_serializer = TransactionSerializer(transaction, data=new_transaction_data, partial=True)

        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            saved_instance = transaction_serializer.save() #save instance
            material.save()
            # Send an email to borrower if the transaction was approved - the request data contained approval_date
            if initial_data.data['approval_date'] is None and saved_instance.approval_date is not None :
                send_approved_email(transaction)
            
            # Send an email to the owner if the transaction was returned - the request data contained return_date
            if initial_data.data['latest_change_status_date'] is None and saved_instance.latest_change_status_date is not None :
                if saved_instance.material.owner.user != saved_instance.borrower : 
                    send_returned_email(transaction)
            
            # Return updated record
            return JsonResponse(transaction_serializer.data)
        
        # Return an error message if the seriliazed - updated - instance is not valid
        raise Exception(transaction_serializer.errors)
    
    except Exception as e:
        print("Error in updating transaction record!", e, "!")
        raise e

def on_cancel_transaction(transaction, request):
    """
    Function to change the status to cancel of an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be updated.
        request (obj): The related data to update in the transaction instance
    """
    try:
        initial_data = TransactionSerializer(transaction)
        material = get_material(pk=initial_data.data['material'])
        # if the loan has not begun the borrower can cancel it
        if initial_data.data.get('transaction_status') in ['Booked','Pending Validation']:
            if initial_data.data['borrower'] != request.user.user_id:
                raise Exception('User cannot cancel this transaction!')
        else:
            raise Exception('This transaction can not be canceled!')
        # Serialize the transaction instance and the data passed through the request
        new_transaction_data = {"transaction_status": "Canceled",
                                "latest_change_status_date": timezone.now(), }
        transaction_serializer = TransactionSerializer(transaction, data=new_transaction_data, partial=True)

        # Validating the tentative transaction

        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            # if it is a donation add back the quantity to the material
            if initial_data.data.get('type') == 'Donation' and initial_data.data.get('transaction_status') == 'Booked':
                new_material = {'quantity_available' : material.quantity_available + float(initial_data.data['transaction_quantity'])}
                # and id the quantity was at 0 set the availability to true
                if material.quantity_available == 0:
                    new_material['available_for_transaction'] = True
                material_serializer = MaterialSerializer(material,data=new_material,partial=True)
                # id the fields of the material are fined sve everything
                if material_serializer.is_valid():
                    transaction_serializer.save()
                    material_serializer.save()
                else:
                    raise Exception(material_serializer.errors)
            else:
                transaction_serializer.save()
        else:
            raise Exception(transaction_serializer.errors)

    except Exception as e:
        raise e

def on_approve_transaction(transaction, request):
    """
    Function to change the status to approve of an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be updated.
        request (obj): The related data to update in the transaction instance
    """
    try:
        initial_data = TransactionSerializer(transaction)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data
        # if the transaction is status is Pending Validation and you are the owner of the material you can approve the transaction
        if initial_data.data.get('transaction_status') == 'Pending Validation':
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot approve this transaction!')
        else:
            raise Exception('This transaction can not be approved!')
        if initial_data['transaction_date'].value == timezone.now().date().strftime('%Y-%m-%d'):
            new_transaction_data = {"transaction_status": "Borrowed",
                                    "approval_date": timezone.now()}
        else:
            new_transaction_data = {"transaction_status": "Booked",
                                    "approval_date": timezone.now()}
        # Serialize/ Merge the transaction instance and the data passed through the request
        transaction_serializer = TransactionSerializer(transaction, data=new_transaction_data, partial=True)


        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            # remove the quantity donated to the material
            if initial_data.data.get('type') == 'Donation':
                new_material = {'quantity_available' : material.quantity_available - float(initial_data.data['transaction_quantity'])}
                if material.quantity_available < 0:
                    raise Exception('You don t have enough materials to accept this transaction')
                elif material.quantity_available == 0:
                    new_material['available_for_transaction'] = False
                material_serializer = MaterialSerializer(material,data=new_material,partial=True)
                if material_serializer.is_valid():
                    transaction_serializer.save()
                    material_serializer.save()
                else:
                    raise Exception(material_serializer.errors)
            else:
                transaction_serializer.save()
        else:
            raise Exception(transaction_serializer.errors)
    except Exception as e:
        raise e


def on_reject_transaction(transaction, request):
    """
    Function to change the status to rejected of an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be updated.
        request (obj): The related data to update in the transaction instance
    """
    try:
        initial_data = TransactionSerializer(transaction)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data
        # if the transaction is status is Pending Validation and you are the owner of the material you can reject the transaction
        if initial_data.data.get('transaction_status') == 'Pending Validation':
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot reject this transaction!')
        else:
            raise Exception('This transaction can not be rejected!')
        new_transaction_data = {"transaction_status": "Rejected",
                                "latest_change_status_date": timezone.now(), }
        # Serialize/ Merge the transaction instance and the data passed through the request
        transaction_serializer = TransactionSerializer(transaction, data=new_transaction_data, partial=True)

        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            transaction_serializer.save()  # save instance

    except Exception as e:
        raise e

def on_close_transaction(transaction, request):
    """
    Function to change the status of an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be updated.
        request (obj): The related data to update in the transaction instance
    """
    try:
        initial_data = TransactionSerializer(transaction)
        material = get_material(pk=initial_data.data['material'])
        material_data = MaterialSerializer(material).data

        # if the transaction active and you are the owner of the material you can close the transaction
        if initial_data.data.get('transaction_status') == 'Borrowed' or initial_data.data.get('transaction_status') == 'Overdue' :
            if material_data["user"] != request.user.user_id:
                raise Exception('User cannot close this transaction!')
        else:
            raise Exception('This transaction can not be Closed!')
        new_transaction_data = {"transaction_status": "Closed",
                                "latest_change_status_date": timezone.now(), }
        # Serialize/ Merge the transaction instance and the data passed through the request
        transaction_serializer = TransactionSerializer(transaction, data=new_transaction_data, partial=True)

        # Validating the tentative transaction
        if transaction_serializer.is_valid():
            transaction_serializer.save()  # save instance

    except Exception as e:
        raise e

def on_delete_transaction(transaction):
    """
    Function to delete an existing transaction record.

    Args:
        transaction (obj): The transaction instance to be deleted.

    Returns:
        json: returns a message with the appropriate http status.
    """
    
    try:
        
        transaction.delete() # delete instance
        return JsonResponse({'message': 'Deleted!'}, status=status.HTTP_200_OK) 
    
    except Exception as e:
        print("Error in transaction delete function!!")
        # Catching any error during deletion
        return JsonResponse({'message': 'Error!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    

def compare_dates(transaction):
    """
    Function to check wether an actual date is bigger (exceeds) the end of a transaction date.

    Args:
        transaction (obj): The transaction instance to make the comparison to.

    Returns:
        boolean: returns true if the transaction is still active and the end date has already passed, else false
    """
    actual_date = datetime.now().date()
    transaction_date = datetime.strptime(transaction['transaction_date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()

    if transaction['duration'] and transaction['duration'] < (actual_date - transaction_date).days and transaction['is_active']==True:
        return True
    return False

def get_detailed_transactions(transactions):
    """
    Function to get a detailed list of related information to a list of transactions.

    Args:
        transactions (list of obj): A list of transaction instances.

    Returns:
        detailed_transactions: list of detailed information
    """
    detailed_transactions = []
    for transaction in transactions:
        transaction_data = TransactionSerializer(transaction).data
        material = transaction.material
        borrower = transaction.borrower
        owner = material.user
        
        # Selecting the needed fields instead of sending the whole record
        # data protecting purpose
        transaction_data['material_details'] = {
            'title' : material.material_title,
            'images' : material.images,
            'origin' : material.origin,
            'duration' : material.loan_duration,
            'quantity_available': material.quantity_available
        }
        
        if borrower is not None :
            transaction_data['borrower_details'] = {
                'user_id' : borrower.user_id, 
                'first_name' : borrower.first_name,
                'last_name' : borrower.last_name,
                'email' : borrower.email
            }
            
        if owner is not None:
            transaction_data['owner_details'] = {
                'user_id' : owner.user_id,
                'first_name' : owner.first_name,
                'last_name' : owner.last_name,
                'email' : owner.email
            }
            
        detailed_transactions.append(transaction_data)
    return detailed_transactions

def check_if_should_be_returned(transaction):
    """
    Function to modify the status if an equipment is due tomorrow or if it's overdue or if the transaction begin today.
    Args:
        transaction (obj): A transaction instance to check.
    """
    # if the start date is today we change the status
    if transaction.transaction_date == datetime.now().date():
        if transaction.transaction_status =='Pending Validation':
            transaction.transaction_status = 'Rejected'
        elif transaction.transaction_status =='Booked':
            transaction.transaction_status = 'Borrowed'
    if transaction.type == 'Loan' and  transaction.transaction_status == 'Borrowed':
        # If the end date is tomorow we send a reminder mail
        if (transaction.transaction_date + timedelta(days=transaction.duration - 1)) == (datetime.now().date() + timedelta(days=1)) :
            send_reminder_email(transaction)
        #if the end date was yesterday we set the status the loan to overdue
        elif  (transaction.transaction_date + timedelta(days=transaction.duration)) == datetime.now().date() :
            transaction.transaction_status = 'Overdue'
    print(transaction.transaction_status)
    transaction.save()