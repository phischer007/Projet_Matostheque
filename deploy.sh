#!/bin/bash

##################################################################################################
# Step 1
### Download matostheque.git
### Navigate to your Django project directory
### Change "user_name" to the user account on your machine !!!
##################################################################################################
cd ~
git clone https://gricad-gitlab.univ-grenoble-alpes.fr/duffouvi/matostheque.git Matostheque_App
cd /home/user_name/Matostheque_App/

##################################################################################################
# Step 2, installation of NodeJS and NPM
# To use a script for NodeJS and NPM (https://github.com/nvm-sh/nvm)
##################################################################################################
sudo apt install -y curl

###  Add NodeSource repository (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm@latest

### Configure npm global -- method 1, edit .bashrc
nano ~/.bashrc # add the commands below

    echo export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Troubleshoot
source ~/.bashrc

##################################################################################################
# Step 3
##################################################################################################
# Install PostgreSQL and create the database for the application
sudo apt update
sudo apt install postgresql postgresql-contrib

# Check if postgreSQL is running properly
sudo systemctl status postgresql

# Connect as postgres user
psql -U postgres

# Create database and a new user
CREATE DATABASE matostheque;
# The your_database_username and your_database_password must match the credentials stored in  the .env file
CREATE USER your_database_username WITH ENCRYPTED PASSWORD 'your_database_password'; 
GRANT ALL PRIVILEGES ON DATABASE matostheque TO your_database_username;
ALTER DATABASE matostheque OWNER TO your_database_username;

## Connect to the newly create database
psql -h localhost -U your_database_username -d matostheque

## Check the available databases
# List of databases
\l  
## OR
SELECT datname FROM pg_database;
# List of relations
\dt 

# Exit psql
\q


# Setup and activate a python virtual environment
sudo apt update && sudo apt install python3 python3-venv -y
python3 -m venv matostheque_venv 
source matostheque_venv/bin/activate

# Install/update project dependencies
pip install -r requirements.txt

# Generate a SECRET_KEY for this project (see sample code)
echo "Generating Django SECRET KEY"

SECRET_KEY=$(python3 <<EOF
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
EOF
)
echo "Django SECRET_KEY : $SECRET_KEY"
echo "SECRET_KEY='$SECRET_KEY'" >> .env

##################################################################################################
# Configuration of Database connection variables in {.env} file with your favorite text editor
# Add your EMAIL_HOST_USER, EMAIL_HOST, DB_NAME, DB_USER, DB_PASSWORD
# and SECRET_KEY (see previous step)
nano .env

# Further modifications, navigate to MatosthequeRestApis
cd MatosthequeRestApis/

##################################################################################################
# Change these information
####  matostheque_server_name.fr == your_server_name
####  your_authentication_server_name.fr == authentication_server_name (eg. CAS, OAthun2, etc.)
nano settings.py 

# Perform database migrations
python3 manage.py makemigrations

# Apply database migrations
python3 manage.py migrate
python3 manage.py migrate Matostheque

# Create a local user to access your Django Administration backend
python3 manage.py createsuperuser

##################################################################################################
# ** Important **
# Test and verify that your backend works perfectly
# Change "DEBUG = False" to "DEBUG = True" in settings.py (MatosthequeRestApis/settings.py)
# Execute "python3 manage.py runserver"
# Open your internet browser, then type "http://localhost:8000/admin" 
### Enter your credentials when creating a superuser in " line 107 "
##################################################################################################

##################################################################################################
# Change ownership because the user {user_name} has permissions to read, write, or execute files #
##################################################################################################
sudo chown -R user_name:user_name /home/user_name/Matostheque_App/assets

# Set permissions to ensure that the assets folder and its contents can be deleted
chmod -R u+w assets

# Collect static files (if needed)
python3 manage.py collectstatic --noinput --clear 


##################################################################################################
# Step 4
##################################################################################################

# Set the DJANGO_ENV environment variable
export DJANGO_ENV=production

##################################################################################################
# Start the Django application using Gunicorn
### Step 4.1
### In the "gunicorn_config.py" change user_name to your linux username account
### Then create a directory "logs" and two files such as access.log and error.log
##################################################################################################
nohup gunicorn -c gunicorn_config.py MatosthequeRestApis.wsgi &

##################################################################################################
# Step 4.2
##################################################################################################
nano /etc/systemd/system/matostheque-backend.service # add the commands below

    [Unit]
    Description=Matostheque Application Service
    After=network.target
    
    [Service]
    Type=simple

    # Specify the working directory
    WorkingDirectory=/home/user_name/Matostheque_App/

    ExecStart=/bin/bash -c 'source /home/user_name/Matostheque_App/matostheque_venv/bin/activate && gunicorn -c gunicorn_config.py MatosthequeRestApis.wsgi'

    # Restart the service on failure
    Restart=always
    
    [Install]
    WantedBy=multi-user.target

# Relaod Daemon
sudo systemctl daemon-reload


##################################################################################################
# Step 4.3
##################################################################################################

# Navigate to the front-end directory
cd /home/user_name/Matostheque_App/fronttheque/

# Install front-end dependencies (if needed)
npm install

# Set NODE_ENV to production
export NODE_ENV=production

# Build the front-end application with NODE_ENV set to production
npm run build

# Start the front-end server
# The "&" symbol execute the command in the background in a subshell
nohup npm run start &
### OR use systemd service
##################################################################################################
# Step 4.4
##################################################################################################
nano /etc/systemd/system/matostheque-frontend.service # add the commands below  

    [Unit]
    Description=Matostheque Frontend Service
    After=network.target

    [Service]
    Type=simple

    # Specify the working directory
    WorkingDirectory=/home/user_name/Matostheque_App/
    Environment=NODE_ENV=production
    ExecStart=/bin/bash -c 'cd /home/nomena/Matostheque_App/fronttheque/ && npm run build && npm run start'

    # Restart the service on failure
    Restart=on-failure
    Uer=user_name
    Group=user_name

    StandardOutput=journal
    StandardError=journal

    [Install]
    WantedBy=multi-user.target