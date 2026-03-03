#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==========================================================="
echo "   Matostheque Initial Setup Script"
echo "==========================================================="

# Prompt for user variables to avoid manual editing later
read -p "Enter your Linux username (default: $USER): " LINUX_USER
LINUX_USER=${LINUX_USER:-$USER}
HOME_DIR=$(eval echo ~$LINUX_USER)
APP_DIR="$HOME_DIR/Matostheque_App"

read -p "Enter desired PostgreSQL Database Username: " DB_USER
read -s -p "Enter desired PostgreSQL Database Password: " DB_PASS
echo ""
DB_NAME="matostheque"

##################################################################################################
# Step 1: Download matostheque.git
##################################################################################################
echo ">>> Cloning Repository..."
cd "$HOME_DIR"
# Remove directory if it already exists to prevent clone errors
if [ -d "$APP_DIR" ]; then rm -rf "$APP_DIR"; fi
git clone https://gricad-gitlab.univ-grenoble-alpes.fr/duffouvi/matostheque.git "$APP_DIR"
cd "$APP_DIR"

##################################################################################################
# Step 2: Installation of NodeJS and NPM
##################################################################################################
echo ">>> Installing NodeJS and NPM..."
sudo apt update
sudo apt install -y curl

# Add NodeSource repository (LTS version) and install
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm@latest

# Configure NVM/NPM in bashrc non-interactively
if ! grep -q 'NVM_DIR="$HOME/.nvm"' "$HOME_DIR/.bashrc"; then
cat << 'EOF' >> "$HOME_DIR/.bashrc"

# Node Version Manager (NVM) configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
fi

##################################################################################################
# Step 3: Install PostgreSQL and Setup Python Environment
##################################################################################################
echo ">>> Installing and Configuring PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Non-interactive PostgreSQL setup
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database might already exist."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';" || echo "User might already exist."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

echo ">>> Setting up Python Virtual Environment..."
sudo apt install -y python3 python3-venv

python3 -m venv matostheque_venv 
source matostheque_venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Generate a SECRET_KEY and create the .env file
echo ">>> Generating Django SECRET KEY and creating .env file..."
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

cat << EOF > .env
SECRET_KEY='$SECRET_KEY'
DB_NAME='$DB_NAME'
DB_USER='$DB_USER'
DB_PASSWORD='$DB_PASS'
# ADD YOUR EMAIL HOST SETTINGS HERE LATER
EMAIL_HOST_USER=''
EMAIL_HOST=''
EOF

cd MatosthequeRestApis/

echo ">>> Clearing old migrations and creating new ones..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete

# Database migrations
echo ">>> Applying Database Migrations..."
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py migrate Matostheque

echo ">>> Please create your Django Superuser..."
python3 manage.py createsuperuser

# Change ownership and permissions
echo ">>> Updating permissions for assets folder..."
sudo chown -R "$LINUX_USER:$LINUX_USER" "$APP_DIR/assets"
chmod -R u+w "$APP_DIR/assets"

# Collect static files
python3 manage.py collectstatic --noinput --clear

##################################################################################################
# Step 4: Systemd Services and Frontend Setup
##################################################################################################
export DJANGO_ENV=production

echo ">>> Creating systemd service for Backend (Gunicorn)..."
sudo tee /etc/systemd/system/matostheque-backend.service > /dev/null << EOF
[Unit]
Description=Matostheque Application Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/bin/bash -c 'source $APP_DIR/matostheque_venv/bin/activate && gunicorn -c gunicorn_config.py MatosthequeRestApis.wsgi'
Restart=always
User=$LINUX_USER
Group=$LINUX_USER

[Install]
WantedBy=multi-user.target
EOF

echo ">>> Setting up Frontend..."
cd "$APP_DIR/fronttheque/"
npm install
export NODE_ENV=production
npm run build

echo ">>> Creating systemd service for Frontend..."
sudo tee /etc/systemd/system/matostheque-frontend.service > /dev/null << EOF
[Unit]
Description=Matostheque Frontend Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production

ExecStart=/bin/bash -c 'cd $APP_DIR/fronttheque/ && npm run start'
Restart=on-failure
User=$LINUX_USER
Group=$LINUX_USER
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo ">>> Reloading daemons and enabling services..."
sudo systemctl daemon-reload
sudo systemctl enable matostheque-backend.service
sudo systemctl enable matostheque-frontend.service

echo "==========================================================="
echo "   Setup Complete!"
echo "==========================================================="
echo "Remaining manual tasks:"
echo "1. Edit your Django settings: nano $APP_DIR/MatosthequeRestApis/settings.py"
echo "2. Edit your Gunicorn config: nano $APP_DIR/gunicorn_config.py"
echo "3. Add your email settings to: nano $APP_DIR/.env"
echo "4. Start your services with:"
echo "   sudo systemctl start matostheque-backend.service"
echo "   sudo systemctl start matostheque-frontend.service"
echo "==========================================================="