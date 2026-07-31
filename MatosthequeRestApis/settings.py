
import os
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Core config.
# ---------------------------------------------------------------------------
load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.environ.get('SECRET_KEY')

DEBUG = (os.environ.get('DEBUG') == "True")

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')

MIGRATION_MODULES = {
    'Matostheque' : 'Matostheque.migrations'
}

# ---------------------------------------------------------------------------
# INSTALLED APPS
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_cas_ng',
    'corsheaders',
    'rest_framework',
    'Matostheque',
    'fronttheque',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
CORS_ORIGIN_ALLOW_ALL = False

CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', '').split(',')

CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',')

CORS_ORIGIN_WHITELIST = os.environ.get('DJANGO_CORS_ORIGIN_WHITELIST', '').split(',')

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'OPTIONS',
    'DELETE',
    'PUT'
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CORS_ALLOW_HEADERS = [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Cache-Control',
    'If-Modified-Since',
    'If-None-Match',
    'User-Agent',
]

# ---------------------------------------------------------------------------
# URLs / WSGI
# ---------------------------------------------------------------------------
ROOT_URLCONF = 'MatosthequeRestApis.urls'
WSGI_APPLICATION = 'MatosthequeRestApis.wsgi.application'

# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

if os.environ.get('DJANGO_ENV') == 'production':
    EMAIL_HOST = os.environ.get('EMAIL_HOST')                        
    EMAIL_PORT = os.environ.get('EMAIL_PORT')                                                                    
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')        
    DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_HOST_USER')      
    EMAIL_USE_TLS = (os.environ.get('EMAIL_USE_TLS') == 'True')                                       
    EMAIL_USE_SSL = False                                      
else:
    # Default SMTP configuration for testing locally
    EMAIL_HOST = 'localhost'
    EMAIL_PORT = 1025
    EMAIL_USE_TLS = False
    DEFAULT_FROM_EMAIL = 'liphy-direction@univ-grenoble-alpes.fr'
    EMAIL_HOST_USER = 'liphy-direction@univ-grenoble-alpes.fr'


# ---------------------------------------------------------------------------
# Template
# ---------------------------------------------------------------------------
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


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        # "HOST": os.environ.get("DB_HOST", "localhost"),
        "HOST": os.environ.get("DB_HOST", "db"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

# ---------------------------------------------------------------------------
# Customize users info and authentification backend models
# ---------------------------------------------------------------------------
AUTH_USER_MODEL = "Matostheque.CustomUsers"

AUTHENTICATION_BACKENDS = [
    'Matostheque.custom_auth.CustomAuth',           # Custom authentication
    'django.contrib.auth.backends.ModelBackend',    # Optionally keeping Default Django authentication backend
    'django_cas_ng.backends.CASBackend',            # CAS authentication backend
]

# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]


# Internationalization
SESSION_COOKIE_AGE = 10800
TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static files (CSS, JavaScript, Images)
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'assets/')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'fronttheque/.next/static'),
]

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
MEDIA_URL = '/media/'

DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800
