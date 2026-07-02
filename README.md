# Mutmat
**Mutmat** is a full-stack virtual library platform designed to facilitate the sharing, lending, and borrowing of equipment, materials, books, and other resources across multiple laboratories and institutions within Université Grenoble Alpes (**UGA**). This initiative, championed by the Vice President for Research and Ecological Transformation of UGA, builds upon an existing internal solution developed by Laboratoire Interdisciplinare de Physique (**LIPhy**), scaling it from a single-laboratory tool into a comprehensive, university-wide resource-sharing ecosystem. 

By enabling efficient peer-to-peer lending across UGA's research community, **Mutmat** aims to reduce redundant equipment purchases, minimize waste, and directly contribute to the university's sustainability and carbon reduction goals.

### Purpose
Our goal is to develop a multi-laboratory equipment loan management platform that directly tackles the environmental impact of scientific research. With nearly 50% of a laboratory's greenhouse gas emissions stemming from the purchase and production of new equipment, this tool will promote resource sharing, extend equipment lifecycles, and significantly reduce the carbon footprint of participating labs through a collaborative, circular economy model.

### Technology Stack

- a Django backend in `Matostheque/` and `MatosthequeRestApis/`
- an NextJS frontend in `fronttheque/`

### Overview
- Backend configuration is driven by environment variables loaded from `.env` (`python-dotenv`).
- PostgreSQL is expected as the database.
- Frontend build artifacts are integrated into Django static files via `STATICFILES_DIRS`.

See `MatosthequeRestApis/settings.py` for backend settings details.

### Requirements
- Python 3
- PostgreSQL
- Node.js LTS and NPM
- Git
- Docker

### Quick start
#### Clone the repository
```bash
git clone https://gricad-gitlab.univ-grenoble-alpes.fr/duffouvi/xxxxxxxxxxxxxx.git
cd Matostheque_App
```

#### Set up you Python environment (Django)
```bash
python3 -m venv matostheque_venv
source matostheque_venv/bin/activate
```

Edit these files
```bash
cp .env.example .env
cp fronttheque/.env.example fronttheque/.env
cp fronttheque/src/utils/config.example.js fronttheque/src/utils/config.js

# Fill credentials and update secret keys as needed. 
# For production, change
## 1. server_name.example.com --> your servername
## 2. cas-authentification.example.com --> your authentification servername
```
To generate a Django SECRET_KEY, you can use the following command:
```bash
echo "Generating Django SECRET KEY"

SECRET_KEY=$(python3 <<EOF
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
EOF
)
echo "Django SECRET_KEY : $SECRET_KEY"

echo "SECRET_KEY='$SECRET_KEY'" >> .env
```

**Install Python dependencies**
```bash
# Delete the exiting migration files
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

pip install --force-reinstall django==4.2.23
pip install -r requirements.txt

# Take ownership of the entire project folder
sudo chown -R $USER:$USER /Matostheque_App/
chmod -R u+w assets
chmod -R u+w media
```
**Configure PostgreSQL Database**
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

sudo -u -i postgres
psql

# Ensure the following credentials match your .env file configuration:
## matostheque, your_database_username, your_database_password
CREATE DATABASE matostheque;
CREATE USER your_database_username WITH ENCRYPTED PASSWORD 'your_database_password';
GRANT ALL PRIVILEGES ON DATABASE matostheque TO your_database_username;
ALTER DATABASE matostheque OWNER TO your_database_username;
```


**Run migrations and start Django**
```bash
# Perform database migrations
python manage.py makemigrations

# Apply database migrations
python manage.py migrate

# Collect static files (if needed)
python manage.py collectstatic --noinput --clear

# Create a local user to access your Django Administration backend
python manage.py createsuperuser 
############ Example #########################
### Follow prompts to create an admin user
### Email: admin@example.com
### Password: admin1234
##############################################

python manage.py runserver 8030
```