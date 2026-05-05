from Matostheque.controllers.owner_controller import get_owner_by_user

def get_formatted_user(user):
    """
    This function takes a user object as input and returns a dictionary 
    containing the user's details. If the user has an associated owner, 
    the owner's details are also included in the dictionary.
    
    Args:
        user (obj): A user object.
    
    Returns:
        user_details (dict): A dictionary containing the user's details.
    """
    # Get the owner object associated with the user
    owner = get_owner_by_user(user.user_id)
    
    # Initialize a dictionary to store the user's details
    user_details = {
        "user_id": user.user_id,
        "last_name": user.last_name,
        "first_name": user.first_name,
        "role": user.role,
        "is_active": user.is_active,
        "is_staff": user.is_staff,
        "email": user.email,
        "profil_pic": user.profil_pic
    }

    # If the user has an associated owner, add the owner's details to the dictionary
    if owner :
        user_details["owner_id"] = owner.owner_id
        user_details["owner_contact"] = owner.contact
    
    return user_details