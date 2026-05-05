
import os
from dotenv import load_dotenv

from corsheaders.defaults import default_headers

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = True

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

env_allowed_hosts = os.getenv('ALLOWED_HOSTS', '')
ALLOWED_HOSTS = [host for host in env_allowed_hosts.split(',') if host]

MIGRATION_MODULES = {
    'Matostheque' : 'Matostheque.migrations'
}

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'Matostheque',
    'fronttheque',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS should be early in the middleware list
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',  # Common middleware should be before CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    
    'django.middleware.locale.LocaleMiddleware',
]

SESSION_COOKIE_AGE = 10800 #3600 is 1 hour in seconds, set to 3 hours for now
TIME_ZONE = 'Europe/Paris'
USE_TZ = True

# --- FIXED CORS SETTINGS ---
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8081',
]

CSRF_TRUSTED_ORIGINS = ['http://localhost', 'http://localhost:3000']

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'OPTIONS',
    'DELETE',
    'PUT'
]

CORS_ALLOW_HEADERS = [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Cache-Control',
    'If-Modified-Since',
    'If-None-Match',
    'User-Agent',
    "X-CSRFToken",
]
""""
env_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = [origin for origin in env_cors_origins.split(',') if origin]


env_cors_whitelist = os.getenv('CORS_ORIGIN_WHITELIST', '')
CORS_ORIGIN_WHITELIST = [origin for origin in env_cors_whitelist.split(',') if origin]





env_csrf_trusted = os.getenv('CSRF_TRUSTED_ORIGINS', '')
CSRF_TRUSTED_ORIGINS = [origin for origin in env_csrf_trusted.split(',') if origin]
"""
ROOT_URLCONF = 'MatosthequeRestApis.urls'

# From here on Email settings:
# Set the email backend to use
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Check if DJANGO_ENV environment variable is set to 'production'
# SMTP configuration for a remote server
# # Really to come by because this not working for real
if os.getenv('DJANGO_ENV') == 'production':
    EMAIL_HOST = os.getenv('EMAIL_HOST')                    
    EMAIL_PORT = 25                                             
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')         
    DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')      
    EMAIL_USE_TLS = False                                       
    EMAIL_USE_SSL = False                                       
else:
    # Default SMTP configuration for testing locally
    EMAIL_HOST = 'localhost'
    EMAIL_PORT = 1025
    EMAIL_USE_TLS = False
    DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'MatosthequeRestApis.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '',
    }
}

AUTH_USER_MODEL = "Matostheque.CustomUsers"

AUTHENTICATION_BACKENDS = [
    'Matostheque.custom_auth.CustomAuth',           
    'django.contrib.auth.backends.ModelBackend',    
]

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'assets/')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'fronttheque/.next/static'),
]

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_ROOT = os.path.join(BASE_DIR, 'assets')
MEDIA_URL = '/assets/' # locally yet
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800
