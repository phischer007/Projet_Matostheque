from django.shortcuts import render
from django.db.models import F, Count, Q

from django.utils import timezone

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status

from django.contrib.auth.decorators import login_required
from Matostheque.models.loan_model import Loans
from Matostheque.serializers import LoanSerializer
from Matostheque.models.material_model import Materials #temporary
from Matostheque.serializers import MaterialSerializer
from rest_framework.decorators import api_view
from Matostheque.controllers.loans_controller import *



@login_required
@api_view(['GET','POST'])
def loan_list(request):
    if request.method == 'GET':
        loans = Loans.objects.all().order_by('-created_at')
        
        selected_loans = loans.values(
            'loan_id',
            'loan_status',
            'loan_date',
            'duration',
            'created_at',
            'is_active', 
            'overdue_flag', 
            'approval_date', 
            'cancellation_date', 
            'return_date', 
            'rejection_date',
            material_title=F('material__material_title'),
            owner_first_name=F('material__owner__user__first_name'),
            owner_last_name=F('material__owner__user__last_name'),
            borrower_first_name=F('borrower__first_name'),
            borrower_last_name=F('borrower__last_name'),
        )
        return JsonResponse(list(selected_loans), safe=False)
 
    elif request.method == 'POST':
        return on_create_loan(request)
        
@login_required    
@api_view(['GET'])
def detailed_loans(request):
    try:
        loans = Loans.objects.all()
    except Loans.DoesNotExist:
        return JsonResponse({'message': 'No loans found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        detailed_loans = get_detailed_loans(loans)
        return JsonResponse(detailed_loans, safe=False)
    

@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def loan_detail(request, pk):
    try: 
        loan = Loans.objects.get(pk=pk) 
    except Loans.DoesNotExist: 
        return JsonResponse({'message': 'The loan does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        loan_serializer = LoanSerializer(loan) 
        return JsonResponse(loan_serializer.data) 
 
    elif request.method == 'PUT': 
        return on_update_loan(loan, request)
    
    elif request.method == 'DELETE': 
        response = on_delete_loan(loan)
        if(response.status_code==200):
            return JsonResponse({'message': 'Loan was deleted successfully!'}, status=status.HTTP_200_OK)
        return JsonResponse({"message": "Error deleting loan record"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@login_required
@api_view(['GET'])
def inDepth_detail_loan(request, pk, isSingleRow = False, isOwner = False): 
    try:
        if isSingleRow :
            loans = Loans.objects.filter(pk=pk)
        else :
            loans = Loans.objects.filter(material__owner_id=pk) if isOwner else Loans.objects.filter(borrower=pk)
    except Loans.DoesNotExist: 
        return JsonResponse({'message': 'No loan under that name'}, status=status.HTTP_404_NOT_FOUND) 
    
    ordered_loans = loans.order_by('-created_at') #ordering a bit before rendering
    if request.method == 'GET': 
        b_detailed_loans = get_detailed_loans(ordered_loans)
        return JsonResponse(b_detailed_loans, safe=False)
    
@login_required
@api_view(['GET'])
def loan_activated(request,s):
    activated = s.lower() == 'true'
    try:
        loans = Loans.objects.filter(is_active=activated)
    except Loans.DoesNotExist: 
        return JsonResponse({'message': 'No loan activated'}, status=status.HTTP_404_NOT_FOUND) 
        
    if request.method == 'GET': 
        loans_serializer = LoanSerializer(loans, many=True)
        return JsonResponse(loans_serializer.data, safe=False)

@login_required
@api_view(['GET'])
def loan_overdue(request):
    loans = Loans.objects.all()
    loans_serializer = LoanSerializer(loans, many=True)
    serialized_data = loans_serializer.data
    overdues = list(filter(compare_dates, serialized_data))
    if request.method == 'GET':
        return JsonResponse(overdues, safe=False)
    
    
@login_required
@api_view(['GET'])
def latest_loan(request, pk):
    loans = Loans.objects.filter(borrower=pk)
    loans_filtered = loans.order_by('-created_at')[:4]
    
    selected_loans = loans_filtered.values(
        'loan_id',
        'loan_date',
        'loan_status',
        'duration',
        material_title=F('material__material_title'),
        owner_first_name=F('material__owner__user__first_name'),
        owner_last_name=F('material__owner__user__last_name')
    )
    if request.method == 'GET': 
        #serializer = LoanSerializer(loans_filtered, many=True)
        return JsonResponse(list(selected_loans), safe=False)


#tasks to run periodically
def update_loans(email_count):
    loans = Loans.objects.all()
    print("In update loans")
    for loan in loans:
        loan.update_overdue_flag()
        check_if_should_be_returned(loan, email_count)
    return loans


# @login_required
# @api_view(['GET'])
# def get_loan_stats(request):
#     """
#     Returns statistics for loans that have been approved (Borrowed).
#     Counts total approved loans, and approvals for the current month and year.
#     """
#     now = timezone.now()
    
#     # Filter for loans that have an approval date (implies they were successfully borrowed)
#     approved_loans = Loans.objects.filter(approval_date__isnull=False)
    
#     total_borrowed = approved_loans.count()
    
#     borrowed_this_month = approved_loans.filter(
#         approval_date__year=now.year,
#         approval_date__month=now.month
#     ).count()
    
#     borrowed_this_year = approved_loans.filter(
#         approval_date__year=now.year
#     ).count()
    
#     data = {
#         'total_borrowed': total_borrowed,
#         'borrowed_this_month': borrowed_this_month,
#         'borrowed_this_year': borrowed_this_year
#     }
    
#     return JsonResponse(data, safe=False)


# @login_required
# @api_view(['GET'])
# def get_loan_stats(request):
#     """
#     Returns statistics for loans that have been approved (Borrowed).
#     Total borrowed is now based on the current year.
#     """
#     now = timezone.now()
    
#     # Filter for loans that have an approval date (implies they were successfully borrowed)
#     approved_loans = Loans.objects.filter(approval_date__isnull=False)
    
#     # Filter total_borrowed by the current year as requested
#     total_borrowed = approved_loans.filter(
#         approval_date__year=now.year
#     ).count()
    
#     borrowed_this_month = approved_loans.filter(
#         approval_date__year=now.year,
#         approval_date__month=now.month
#     ).count()
    
#     borrowed_this_year = approved_loans.filter(
#         approval_date__year=now.year
#     ).count()

    
    
#     data = {
#         'total_borrowed': total_borrowed,
#         'borrowed_this_month': borrowed_this_month,
#         'borrowed_this_year': borrowed_this_year
#     }
    
#     return JsonResponse(data, safe=False)

@login_required
@api_view(['GET'])
def get_loan_stats(request):
    """
    Returns statistics for loans that have been approved (Borrowed).
    - Total borrowed (filtered by current year).
    - Breakdown for the last 3 months.
    """
    now = timezone.now()
    
    # Base filter: Loans that have been approved
    approved_loans = Loans.objects.filter(approval_date__isnull=False)
    
    # 1. Total Borrowed (Current Year)
    total_borrowed = approved_loans.filter(
        approval_date__year=now.year
    ).count()
    
    # 2. Stats for this specific month/year (for the quick stats)
    borrowed_this_month = approved_loans.filter(
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
            
        count = approved_loans.filter(
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