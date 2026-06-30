from django.shortcuts import render
from django.db.models import F, Count, Q

from django.utils import timezone

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from django.contrib.auth.decorators import login_required
from Matostheque.models.transaction_model import Transactions
from Matostheque.serializers import TransactionSerializer
from Matostheque.models.material_model import Materials #temporary
from Matostheque.serializers import MaterialSerializer
from rest_framework.decorators import api_view
from Matostheque.controllers.transactions_controller import *


@login_required
@api_view(['GET','POST'])
def transaction_list(request):
    if request.method == 'GET':
        transactions = Transactions.objects.all().order_by('-created_at')
        selected_transaction = transactions.values(
            'transaction_id',
            'transaction_status',
            'transaction_date',
            'duration',
            'transaction_quantity',
            material_type=F('material__type'),
            material_title=F('material__material_title'),
            user_first_name=F('material__user__first_name'),
            user_last_name=F('material__user__last_name'),
            borrower_first_name=F('borrower__first_name'),
            borrower_last_name=F('borrower__last_name'),
        )
        return JsonResponse(list(selected_transaction), safe=False)

    elif request.method == 'POST':
        try:
            return on_create_transaction(request)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@login_required
@api_view(['GET'])
def detailed_transactions(request):
    try:
        transactions = Transactions.objects.all()
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'No transactions found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        detailed_transactions = get_detailed_transactions(transactions)
        return JsonResponse(detailed_transactions, safe=False)

@login_required
@api_view(['PUT'])
def cancel_transaction(request, pk):
    try:
        transaction = Transactions.objects.get(pk=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'The transaction does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        on_cancel_transaction(transaction,request)
        send_cancelled_email(transaction)
        return JsonResponse({'message': 'Transaction was canceled successfully!'}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)

@login_required
@api_view(['PUT'])
def approve_transaction(request, pk):
    try:
        transaction = Transactions.objects.get(pk=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'The transaction does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        on_approve_transaction(transaction, request)
        send_approved_email(transaction)
        return JsonResponse({'message': 'Transaction was approved successfully!'}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)

@login_required
@api_view(['PUT'])
def reject_transaction(request, pk):
    try:
        transaction = Transactions.objects.get(pk=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'The transaction does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        on_reject_transaction(transaction, request)
        send_refused_email(transaction)
        return JsonResponse({'message': 'Transaction was rejected successfully!'}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)

@login_required
@api_view(['PUT'])
def closed_transaction(request, pk):
    try:
        transaction = Transactions.objects.get(pk=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'The transaction does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        on_close_transaction(transaction, request)
        return JsonResponse({'message': 'Transaction was closed successfully!'}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)

@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def transaction_detail(request, pk):
    try:
        transaction = Transactions.objects.get(pk=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'The transaction does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        transaction_serializer = TransactionSerializer( transaction)
        return JsonResponse(transaction_serializer.data)

    elif request.method == 'PUT':
        try:
            return on_update_transaction( transaction, request)
        except Exception as e:
            return JsonResponse({'message': str(e.__str__())}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        if not request.user.is_staff:
            return JsonResponse({'message': 'You are not authorized to delete this Transactions.'},
                                status=status.HTTP_403_FORBIDDEN)
        response = on_delete_transaction( transaction)
        if(response.status_code==200):
            return JsonResponse({'message': 'Transaction was deleted successfully!'}, status=status.HTTP_200_OK)
        return JsonResponse({"message": "Error deleting transaction record"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@login_required
@api_view(['GET'])
def inDepth_detail_transaction(request, pk, isSingleRow = False, isOwner = False):
    try:
        if isSingleRow :
            transactions = Transactions.objects.filter(pk=pk)
        else :
            transactions = Transactions.objects.filter(material__user_id=pk) if isOwner else Transactions.objects.filter(borrower=pk)
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'No transaction under that name'}, status=status.HTTP_404_NOT_FOUND)
    ordered_transactions = transactions.order_by('-created_at') #ordering a bit before rendering
    if request.method == 'GET':
        detailed_transaction = get_detailed_transactions(ordered_transactions)
        return JsonResponse(detailed_transaction, safe=False)

@login_required
@api_view(['GET'])
def transaction_activated(request, s):
    activated = s.lower() == 'true'
    try:
        transactions = Transactions.objects.filter(transaction_status='Borrowed')
    except Transactions.DoesNotExist:
        return JsonResponse({'message': 'No transaction activated'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        transactions_serializer = TransactionSerializer(transactions, many=True)
        return JsonResponse(transactions_serializer.data, safe=False)

@login_required
@api_view(['GET'])
def transaction_overdue(request):
    transactions = Transactions.objects.all()
    transactions_serializer = TransactionSerializer(transactions, many=True)
    serialized_data = transactions_serializer.data
    overdues = list(filter(compare_dates, serialized_data))
    if request.method == 'GET':
        return JsonResponse(overdues, safe=False)


@login_required
@api_view(['GET'])
def latest_transaction(request, pk):
    transactions = Transactions.objects.filter(borrower=pk)
    transactions_filtered = transactions.order_by('-created_at')[:4]

    selected_transactions = transactions_filtered.values(
        'transaction_id',
        'type',
        'transaction_date',
        'duration',
        'transaction_status',
        'transaction_quantity',
        material_title=F('material__material_title'),
        owner_first_name=F('material__user__first_name'),
        owner_last_name=F('material__user__last_name')
    )
    if request.method == 'GET':
        #serializer = TransactionSerializer(transactions_filtered, many=True)
        return JsonResponse(list(selected_transactions), safe=False)


#tasks to run periodically
def update_transactions():
    transactions = Transactions.objects.filter(transaction_status__in=['Pending Validation','Booked','Borrowed'])
    print("In update transactions")
    for transaction in transactions:
        check_if_should_be_returned(transaction)
    return transactions


@login_required
@api_view(['GET'])
def get_transaction_stats(request):
    """
    Returns statistics for transactions that have been approved (Borrowed).
    - Total borrowed (filtered by current year).
    - Breakdown for the last 3 months.
    """
    now = timezone.now()

    # Base filter: Transactions that have been approved
    approved_transactions = Transactions.objects.filter(approval_date__isnull=False)

    # 1. Total Borrowed (Current Year)
    total_borrowed = approved_transactions.filter(
        approval_date__year=now.year
    ).count()

    # 2. Stats for this specific month/year (for the quick stats)
    borrowed_this_month = approved_transactions.filter(
        approval_date__year=now.year,
        approval_date__month=now.month
    ).count()

    borrowed_this_year = total_borrowed # Same as total in this logic

    # 3. Last 3 Months Breakdown
    last_3_months = []
    current_month = now.month
    current_year = now.year

    for i in range(3):
        # Calculate target month and year backwards (0, 1, 2 months ago)
        target_month = current_month - i
        target_year = current_year

        # Adjust for year change if month goes below 1 (e.g., January - 1 = December of prev year)
        if target_month <= 0:
            target_month += 12
            target_year -= 1

        count = approved_transactions.filter(
            approval_date__year=target_year,
            approval_date__month=target_month
        ).count()

        # Get readable month name (e.g., "October")
        month_name = datetime(target_year, target_month, 1).strftime('%B')

        last_3_months.append({
            'month': month_name,
            'year': target_year,
            'count': count
        })

    data = {
        'total_borrowed': total_borrowed,
        'borrowed_this_month': borrowed_this_month,
        'borrowed_this_year': borrowed_this_year,
        'last_3_months': last_3_months
    }

    return JsonResponse(data, safe=False)