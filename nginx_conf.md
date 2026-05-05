#############################################################################################
# Before installing, check if your operating system and architecture are supported
#############################################################################################

sudo apt update && sudo apt install curl gnupg2 ca-certificates lsb-release 
sudo apt update -y && sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'

## Start NGINX and verify that NGINX is up and running using curl command 
sudo nginx
curl -I 127.0.0.1

## Expected output:

# HTTP/1.1 200 OK
# Server: nginx/1.29.0

## Setting Up Server Blocks
### Now, let's create a server block with the correct directives that point to your our application. 
### Instead of modifying the default configuration file directly /etc/nginx/sites-available/server-matostheque.conf

server {
    listen 8080;
    server_name your_server_name;

    location / {
         return 301 https://$server_name$request_uri/;
    }
}

server {

    listen 443 ssl; #Listen on 443 for HTTPS requests
    server_name your_server_name;

    # SSL certificate path: TODO: CHANGE TO SOMETHING ELSE (NOT RELATED TO USER HOME)
    ssl_certificate 
    ssl_certificate_key 


    location /matostheque {
        # Configuration for proxying requests to the frontend running on port >
        proxy_pass http://127.0.0.1:3039;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_buffers 256 16k;
        proxy_buffer_size 16k;
        client_max_body_size 5M;
        client_body_timeout 60;
        send_timeout 300;
        lingering_timeout 5;
        proxy_connect_timeout 90;
        proxy_send_timeout 300;
        proxy_read_timeout 90s;

    }


    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Include CSRF token cookie for API requests
        proxy_set_header X-CSRFToken $cookie_csrftoken;

        # Add CORS headers
        add_header Access-Control-Allow-Origin *;  # For production, replace * with specific origins
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization';

        # For handling preflight requests
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization';
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }

     location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;  # admin panel running on the same port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Include CSRF token cookie for admin panel requests
        proxy_set_header X-CSRFToken $cookie_csrftoken;

    }

    location /static/ {
        alias "/home/user_name/Matostheque_App/assets/";
    }
}

