#!/usr/bin/env bash

# Stop execution if any command fails
set -e

# Wait for PostgreSQL to be ready
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    echo "Waiting for PostgreSQL to be ready..."
    until nc -z "$DB_HOST" "$DB_PORT"; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    echo "PostgreSQL is up and running!"
fi

python manage.py makemigrations
python manage.py migrate --noinput

python manage.py collectstatic --noinput --clear

echo "Checking/Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.fr')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin1234')

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
    print(f'Superuser \'{email}\' created successfully.')
else:
    print(f'Superuser \'{email}\' already exists. Skipping creation.')
"

echo "Starting Gunicorn..."
python -m gunicorn --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    MatosthequeRestApis.wsgi:application