from django.db.models import Q


def get_user_data(data):
    email = data.get("email", None)
    phone_number = data.get("phone_number", None)
    if not email and not phone_number:
        raise KeyError("At least on of the values should be provided.")
    return email, phone_number, data['password']


def get_filtering_query(email, phone_number):
    filter_query = Q()

    if email is not None:
        filter_query |= Q(email=email)

    if phone_number is not None:
        filter_query |= Q(phone_number=phone_number)

    return filter_query
