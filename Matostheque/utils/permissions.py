

def can_manage_lab_resource(user, resource_laboratory):
    """
    Returns True if the user is a staff member of the given laboratory.
    """
    return user.is_staff and user.laboratory == resource_laboratory

def can_manage_material(user, material):
    """
    Returns True if the user owns the material OR is a staff member in the material's laboratory.
    """
    is_owner = user.pk == material.user_id
    return is_owner or can_manage_lab_resource(user, material.user.laboratory)