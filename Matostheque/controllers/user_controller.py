
def get_formatted_user(user):
    """
    This function takes a user object as input and returns a dictionary 
    containing the user's details. If the user has an associated user, 
    the user's details are also included in the dictionary.
    
    Args:
        user (obj): A user object.
    
    Returns:
        user_details (dict): A dictionary containing the user's details.
    """
    #ToDO ajouter les labs auquelles il appartient

    # Initialize a dictionary to store the user's details
    user_details = {
        "user_id": user.user_id,
        "last_name": user.last_name,
        "first_name": user.first_name,
        "phone_number": user.phone_number,
        "role": user.role,
        "is_active": user.is_active,
        "is_staff": user.is_staff,
        "email": user.email,
        "profil_pic": user.profil_pic,
        "laboratory_address": user.laboratory.laboratory_address,
    }
    
    return user_details


def get_lite_Users(users):
    """
    Function to get a list of lite information related to a list of user.

    Args:
        users (list of obj) : A list of user instance
    Returns:
        array: returns a list of related information to each user instance.
    """
    user_detail = []
    for user in users:
        user_data = {
            'user_id': user.user_id,
            'owner_name': f"{user.first_name} {user.last_name}",
        }
        user_detail.append(user_data)
    return user_detail