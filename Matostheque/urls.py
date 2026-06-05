# File that links the api endpoint to their designated url path
from django.urls import path 
from Matostheque.views import material_views 
from Matostheque.views import transaction_views
from Matostheque.views import user_views 
from Matostheque.views import notification_views 
from Matostheque.views import comment_views
from Matostheque.views import trust_circle_views 
 
urlpatterns = [ 
    path('materials/', material_views.get_materials), #get the list of all materials
    path('materials/lite/', material_views.get_materials_lite),#get the lite version list  of all materials (only a few  fields)
    path('materials/create/', material_views.create_material),#create a new material
    path('materials/<int:pk>/', material_views.material_detail),#get one specific material by its id and return an indepth view
    path('materials/owner/<int:pk>/', material_views.material_list_per_owner),#get all materials  that belong to a certain user, filtered by search string
    path('materials/latest/', material_views.latest_material),#get the latest added materials
    path('material/<int:pk>/events/', material_views.material_events_detail),#get a detailed list of all events relative to a specific material
    path('material/<int:pk>/events/lite/', material_views.material_events_lite),#get a lite list of all events relative to a specific material
    path('materials/count/', material_views.get_total_count),#get a lite list of all events relative to a specific material
    path('materials/<int:pk>/availability/',material_views.update_material_availability),# change the availability of the specific material


    path('transactions/', transaction_views.transaction_list),#get a list of all transactions
    path('transactions/details/', transaction_views.detailed_transactions),#get a full indepth view of all transactions
    path('transactions/details/<int:pk>/', transaction_views.inDepth_detail_transaction, {'isSingleRow': True}),#get a full indepth view of all transactions
    path('transactions/details/user/<int:pk>/', transaction_views.inDepth_detail_transaction, {'isOwner': False}),#get a full indepth view for all transactions that belong to one specific borrower
    path('transactions/details/owner/<int:pk>/', transaction_views.inDepth_detail_transaction, {'isOwner': True}),#get a full indepth view for all transactions that belong to one specific owner
    path('transactions/<int:pk>/', transaction_views.transaction_detail),#get a full indepth view for a specific transaction
    path('transactions/on/<str:s>/', transaction_views.transaction_activated),#get a list of all transaction currently active
    path('transactions/overdue/', transaction_views.transaction_overdue),#get a list of all overdue materials
    path('transactions/latest/<int:pk>/', transaction_views.latest_transaction),#get the latest transaction of a user
    path('transactions/cancel/<int:pk>/', transaction_views.cancel_transaction),  # cancel the transaction
    path('transactions/approve/<int:pk>/', transaction_views.approve_transaction),  # approve the transaction
    path('transactions/reject/<int:pk>/', transaction_views.reject_transaction),  # reject transaction
    path('transactions/closed/<int:pk>/', transaction_views.closed_transaction),  # close the  transaction

    path('transactions/stats/', transaction_views.get_transaction_stats), #get transaction statistics

    path('users/', user_views.user_list),  # get a list of all users
    path('users/<int:pk>/', user_views.user_detail),#get, update and delete user info
    path('users/upload_pictures/<int:pk>/', user_views.upload_profile_pic),#upload and override profile pictures
    path('users/changeActivity/<int:pk>/', user_views.changeActivity),  # change the activity of a user
    path('active_owners/lite/', user_views.active_owners_lite),  # get a lite  version of the owner list

    path('notifications/', notification_views.notification_operations),#get a list of all notifications for now
    path('notifications/<int:pk>/', notification_views.user_notification_list),#get a list of all notifications for now
    path('notifications/important/<int:pk>/', notification_views.user_important_notification_list),#get a list of all notifications for now
    
    path('comments/', comment_views.comments_operations),#fetching or creating new comments
    path('comments/detailed/', comment_views.get_formatted_comments),#fetching or creating new comments
    path('comments/<int:pk>/', comment_views.single_comment_operations),#updating or deleting comments

    path('trust_circle/', trust_circle_views.my_trust_circle),

    #path('login/', user_views.api_login, name='api_login'),
    #path('register/', user_views.api_register, name='api_register'),
    #path('logout/', user_views.api_logout, name='api_logout'),
    #path('session/', user_views.session_data, name='session_data'),

    path('cas/login/', user_views.cas_login, name='cas_ng_login'),
    path('cas/validate/', user_views.cas_validate, name='cas_validate'),
    path('cas/logout/', user_views.cas_logout, name='cas_logout'),
    path('session/', user_views.session_data, name='session_data'), 


]
