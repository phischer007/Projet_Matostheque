# This file is for managing email-related functionality 
from django.core.mail import BadHeaderError, send_mail, EmailMessage
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


# Function to send a registration email to the user passed in argument
def send_registration_email(user):
    context = {'user': user} # passing the argument used in the html file
    html_message = render_to_string('emails/signup_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Welcome Aboard!'
    from_email = settings.EMAIL_HOST_USER
    to_email = user['email']
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)


# Function to send an email to notify the owner of a pending request 
def send_validation_email(loan):
    context = {
        'domain': settings.ALLOWED_HOSTS[0], # Get the domain name of the server

        'material': {
            'name': loan.material.material_title,
            'id': loan.material.material_id
            ,
            'link': f"/matostheque/details/material-detail/{loan.material.material_id}"
        },
        'requestee': {
            'full_name': loan.borrower.first_name + " " + loan.borrower.last_name,
        },
        'owner': {
            'first_name': loan.material.user.first_name
        },
        'loan_date': loan.loan_date,
        'duration': loan.duration,
        'location': loan.location,
        'message': loan.message,
        'id': loan.loan_id
    }
    html_message = render_to_string('emails/loanvalidation_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'New Request Matostheque'
    from_email = settings.EMAIL_HOST_USER
    to_email = loan.material.user.email
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)


# Function to send an email of reminder for return to the borrower of the equipment
def send_reminder_email(loan):
    context = {
        'domain': settings.ALLOWED_HOSTS[0],
        'material': {
            'name': loan.material.material_title,
            'id': loan.material.material_id
            ,
            'link': f"/matostheque/details/material-detail/{loan.material.material_id}"
        },
        'borrower': {
            'first_name': loan.borrower.first_name
        }
    }
    html_message = render_to_string('emails/loannearingend_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Reminder Matostheque'
    from_email = settings.EMAIL_HOST_USER
    to_email = loan.borrower.email
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message) # commenting sendig the email

# Function to send an email to notify the borrower after validation of a pending request
def send_approved_email(loan):
    context = {
        'domain': settings.ALLOWED_HOSTS[0],
        'material': {
            'name': loan.material.material_title,
            'id': loan.material.material_id
            ,
            'link': f"/matostheque/details/material-detail/{loan.material.material_id}"
        },
        'borrower': {
            'first_name': loan.borrower.first_name
        }
    }
    html_message = render_to_string('emails/loanapproved_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Loan Approved'
    from_email = settings.EMAIL_HOST_USER
    to_email =  loan.borrower.email
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)

# Function to send an email to notify the owner that the loan is cancelled
def send_cancelled_email(loan):
    context = {
        'domain': settings.ALLOWED_HOSTS[0],
        'material': {
            'name': loan.material.material_title,
        },
        'owner': {
            'first_name': loan.material.owner.first_name
        }
    }
    html_message = render_to_string('emails/loancancellation_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Loan Approved'
    from_email = settings.EMAIL_HOST_USER
    to_email =  loan.borrower.email
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)

# Function to send an email to notify the borrower that the loan is refused
def send_refused_email(loan):
    context = {
        'domain': settings.ALLOWED_HOSTS[0],
        'material': {
            'name': loan.material.material_title,
        },
        'borrower': {
            'first_name': loan.borrower.first_name
        }
    }
    html_message = render_to_string('emails/loanrefused_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Loan Approved'
    from_email = settings.EMAIL_HOST_USER
    to_email =  loan.borrower.email
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)

