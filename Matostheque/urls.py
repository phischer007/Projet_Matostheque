# File that links the api endpoint to their designated url path
from django.urls import path 
from Matostheque.views import material_views 
from Matostheque.views import owner_views 
from Matostheque.views import loan_views 
from Matostheque.views import user_views 
from Matostheque.views import notification_views 
from Matostheque.views import comment_views 
 
urlpatterns = [ 
    path('materials/', material_views.get_materials), #get the list of all materials
    path('materials/lite/', material_views.get_materials_lite),#get the lite version list  of all materials (only a few  fields)
    path('materials/create/', material_views.create_material),#create a new material
    path('materials/<int:pk>/', material_views.material_detail),#get one specific material by its id and return an indepth view
    path('materials/available/', material_views.material_list_available),#get all available materials
    path('materials/owner/<int:pk>/', material_views.material_list_per_owner),#get all materials  that belong to a certain owner, filtered by search string
    path('materials/latest/', material_views.latest_material),#get the latest added materials
    path('material/<int:pk>/events/', material_views.material_events_detail),#get a detailed list of all events relative to a specific material
    path('material/<int:pk>/events/lite/', material_views.material_events_lite),#get a lite list of all events relative to a specific material
    path('materials/count/', material_views.get_total_count),#get a lite list of all events relative to a specific material
    

    path('owners/', owner_views.owner_list),#get a list of all owners
    path('owners/<int:pk>/', owner_views.owner_detail),#get  information about one specific owner
    path('active_owners/lite/', owner_views.active_owners_lite),#get a lite  version of the owner list

    path('loans/', loan_views.loan_list),#get a list of all loans
    path('loans/details/', loan_views.detailed_loans),#get a full indepth view of all loans
    path('loans/details/<int:pk>/', loan_views.inDepth_detail_loan, {'isSingleRow': True}),#get a full indepth view of all loans
    path('loans/details/user/<int:pk>/', loan_views.inDepth_detail_loan, {'isOwner': False}),#get a full indepth view for all loans that belong to one specific borrower
    path('loans/details/owner/<int:pk>/', loan_views.inDepth_detail_loan, {'isOwner': True}),#get a full indepth view for all loans that belong to one specific owner
    path('loans/<int:pk>/', loan_views.loan_detail),#get a full indepth view for a specific loan
    path('loans/on/<str:s>/', loan_views.loan_activated),#get a list of all loan currently active
    path('loans/overdue/', loan_views.loan_overdue),#get a list of all overdue materials
    path('loans/latest/<int:pk>/', loan_views.latest_loan),#get the latest loan of a user

    path('loans/stats/', loan_views.get_loan_stats), #get loan statistics

    path('users/', user_views.user_list),#get a list of all users
    path('users/<int:pk>/', user_views.user_detail),#get, update and delete user info
    path('users/upload_pictures/<int:pk>/', user_views.upload_profile_pic),#upload and override profile pictures

    path('notifications/', notification_views.notification_operations),#get a list of all notifications for now
    path('notifications/<int:pk>/', notification_views.user_notification_list),#get a list of all notifications for now
    path('notifications/important/<int:pk>/', notification_views.user_important_notification_list),#get a list of all notifications for now
    
    path('comments/', comment_views.comments_operations),#fetching or creating new comments
    path('comments/detailed/', comment_views.get_formatted_comments),#fetching or creating new comments
    path('comments/<int:pk>/', comment_views.single_comment_operations),#updating or deleting comments

    path('cas/login/', user_views.cas_login, name='cas_ng_login'),
    path('cas/validate/', user_views.cas_validate, name='cas_validate'),
    path('cas/logout/', user_views.cas_logout, name='cas_logout'),
    path('session/', user_views.session_data, name='session_data'), 
]
