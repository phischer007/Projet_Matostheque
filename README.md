# Matostheque

**Matostheque** is a full-stack virtual library platform designed to facilitate the sharing, lending, and borrowing of equipment, books, and other materials within the Laboratoire Interdisciplinaire de Physique (**LIPhy**) of CNRS and Université Grenoble Alpes (**UGA**). 

Championed by the laboratory's Environmental Footprint Commission, this peer-to-peer platform tackles the environmental impact of scientific research. Because nearly 50% of a laboratory's greenhouse gas emissions stem from producing and purchasing new equipment, Matostheque leverages a circular economy model to reduce redundant purchases, extend equipment lifecycles, and directly support the carbon reduction goals of UGA and CNRS.

## Architecture & Requirements

### Technology Stack
*   **Backend:** Django (located in `Matostheque/` and `MatosthequeRestApis/`)
*   **Frontend:** Next.js (located in `fronttheque/`)
*   **Database:** PostgreSQL
*   **Configuration:** Environment variables loaded via `python-dotenv`
*   **Static Files:** Frontend build artifacts are integrated into Django static files via `STATICFILES_DIRS`.

### Prerequisites
Ensure your host system has the following installed:
*   Python 3
*   PostgreSQL
*   Node.js (LTS) and NPM
*   Git
*   Docker (if choosing containerized deployment)

---

## Phase 1: Initial Setup

### 1. Clone the Repository
```bash
# Clone one of the repository

git clone -b deployment --single-branch https://github.com/phischer007/Projet_Matostheque.git Matostheque_App

OR 

git clone -b sanscas --single-branch https://gricad-gitlab.univ-grenoble-alpes.fr/duffouvi/matostheque.git Matostheque_App

cd Matostheque_App
```
### 2. Configure Environment Variables
Note: This configuration is tailored for Dockerized production environments.

* Set up the root environment file

Copy the local template to create your active .env file
```bash
cp .env.local .env 
```
* Configure the reverse proxy

Depending on your preferred reverse proxy for HTTPS, copy the corresponding Docker Compose template:

```bash
# Option A: NGINX Reverse Proxy
cp docker-compose-nginx.yml docker-compose.yml

# Option B: Traefik
cp docker-compose-traefik.yml docker-compose.yml
```
```bash
## Make sure to change .env.local to .env in your docker-compose.yml

# NB: There are two separate configuration for HTTPS (Production)
# On line 14, change **-postgres** to your **DB_USER** and **-matostheque** to your **DB_NAME** in your .env file 

# 1. Production using NGINX Reverse Proxy
cp docker-compose-nginx.yml docker-compose.yml

# 2. Production using Traefik Reverse Proxy
cp docker-compose-traefik.yml docker-compose.yml
```

* Initialize frontend configurations

Set up the fronttheque directory by creating the active files from their respective examples:
```bash
cp fronttheque/.env.example fronttheque/.env
cp fronttheque/Dockerfile.example fronttheque/Dockerfile
cp fronttheque/package.example.json fronttheque/package.json
cp fronttheque/src/utils/config.example.js fronttheque/src/utils/config.js

# Finalize domain and credentials
# Review all newly created files (i.e., .env, Dockerfile, package.json, config.js) and configuration files to input your specific system credentials. Be sure to find and replace your-server_name.example.com with your actual production domain.
```

**Generate a Django Secret Key:**

Run this snippet to generate a secure secret key, then copy the output into your backend **.env** file:
```bash
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
echo "Your new Django SECRET_KEY is: $SECRET_KEY"
```
---

## Phase 2: Database Configuration
**Use this step, if you are not going to use Docker Containerization**

Install PostgreSQL and set up the matostheque database.
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Access the PostgreSQL prompt
sudo -u -i postgres
```
Execute the following SQL commands (ensure the credentials match what you set in your .env file):
```sql
CREATE DATABASE matostheque;
CREATE USER your_database_username WITH ENCRYPTED PASSWORD 'your_database_password';
GRANT ALL PRIVILEGES ON DATABASE matostheque TO your_database_username;
ALTER DATABASE matostheque OWNER TO your_database_username;
\q
```

## Phase 3: Backend Preparation
Set up the Python environment, install dependencies, and configure directory permissions.
```bash
# Initialize and activate the virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Clear out any existing compiled migrations
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Install requirements
pip install --force-reinstall django==4.2.23
pip install -r requirements.txt

# Fix permissions for media and static assets
sudo chown -R $USER:$USER . OR sudo chown -R $USER:$USER Matostheque_App
chmod -R u+w assets media
```

## Phase 4: Deployment Options
You can deploy Matostheque using Docker containers or directly on the host using systemd services.

### Option A: Deployment With Docker
If using [Docker](https://docs.docker.com/desktop/setup/install/linux/debian/), the deployment is orchestrated via [Compose](https://docs.docker.com/compose/install/):. Review and adjust the following files before launching:
* docker-compose.yml
* Dockerfile
* entrypoint.prod.sh
* fronttheque/Dockerfile

### Option B.1 : Deployment without Docker (Systemd)
If you are not using Docker, you will need to run database migrations (**Ref: Phase 2**), collect static files, and set up systemd services.

**Initialize Django**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput --clear

# Create an administrator account (follow the prompts)
python manage.py createsuperuser
```
**Create the Backend Service**

Create a new service file for Gunicorn
```bash 
sudo nano /etc/systemd/system/matostheque-backend.service
```
Add the following configuration (replace **user_name** and paths as necessary):
```bash
[Unit]
Description=Matostheque Backend Service
After=network.target

[Service]
Type=simple
User=user_name
WorkingDirectory=/home/user_name/Matostheque_App/
ExecStart=/bin/bash -c 'source /home/user_name/Matostheque_App/.venv/bin/activate && gunicorn -c gunicorn.conf.py MatosthequeRestApis.wsgi'
Restart=always

[Install]
WantedBy=multi-user.target
```
**Create the Frontend Service**

First, install the Next.js dependencies:
```bash
cd fronttheque/
npm install
```
Then, create the frontend service file:
```bash
sudo nano /etc/systemd/system/matostheque-frontend.service
```
Add the following configuration:
```bash
[Unit]
Description=Matostheque Frontend Service
After=network.target

[Service]
Type=simple
User=user_name
Group=user_name
WorkingDirectory=/home/user_name/Matostheque_App/fronttheque/
Environment=NODE_ENV=production

# Note: Running npm run build in the service will delay startups. 
# For production, it is recommended to run 'npm run build' manually and only keep 'npm run start' here.
ExecStart=/bin/bash -c 'npm run build && npm run start'

Restart=on-failure
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```
Enable and start your services:
```bash
sudo systemctl daemon-reload

sudo systemctl enable matostheque-backend matostheque-fronttheque
sudo systemctl start matostheque-backend matostheque-fronttheque
```

### Option B.2 :Routing & Access

#### Nginx Reverse Proxy

To ensure seamless communication between the frontend and backend without triggering CORS restrictions, configure an NGINX reverse proxy.

Use the provided template at **nginx/nginx.example.conf**. Rename this file to **matostheque.conf** (or similar) and place it in your **/etc/nginx/sites-available/** directory. For detailed instructions, refer to the official [NGINX Reverse Proxy documentation](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).

#### Local URLs

Frontend Application:
* Development: http://localhost:3000/matostheque
* Production: https://your-server-name.example.com/matostheque

Django Administration:
* Development: http://localhost:8000/admin
* Production: https://your-server-name.example.com/admin