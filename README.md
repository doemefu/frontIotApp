<h1> IOT-App Frontend </h1>


<!-- TOC -->
* [Deployment to Raspberry Pi 3](#deployment-to-raspberry-pi-3)
  * [Prerequisites](#prerequisites)
  * [Network](#network)
  * [Frontend](#frontend)
  * [File transfer](#file-transfer)
    * [SCP](#scp)
    * [Docker-SSH](#docker-ssh)
* [Notes](#notes)
<!-- TOC -->


# Deployment to Raspberry Pi 3

## Prerequisites

- Docker installed on Raspberry Pi 3
- Docker installed on local machine
- SSH connection to Raspberry Pi 3
- Portforwarding on router
  - Port 80 to Raspberry Pi 3 (HTTP)
  - Port 443 to Raspberry Pi 3 (HTTPS)

## Network

Nginx is used as a reverse proxy to route the traffic to the correct container.
```docker-compose
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"  # HTTP
      - "443:443"  # HTTPS
    restart: always
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro  # Correct path for Nginx config :ro for read only
      - ./certbot/www:/var/www/certbot/:ro
      - ./certbot/conf/:/etc/nginx/ssl/:ro
```

### Certbot

Certbot is used to generate the SSL certificates for HTTPS.
```docker-compose
  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./certbot/www/:/var/www/certbot/:rw # read-write to same volume as nginx
      - ./certbot/conf/:/etc/letsencrypt/:rw
      ```

## Frontend

Runs on the Raspberry Pi 3 in a Docker container with port 33 exposed.
```docker-compose
  app:
    image: iot-app:front
    ports:
      - "33:33"
    restart: always
```

## File transfer

### SCP
1. **Download the image from Docker.** </br>
   ```docker save -o <path for generated tar file> <image name>``` </br>

2. **Copy the image to the remote host.** </br>
   ```scp <path for generated tar file> username@remote-host:<path for remote directory>``` </br>
   ```scp -P 22 front-iot-image dfurchert@192.168.1.156:/home/dfurchert/frontIotApp nginx.conf```

3. **Load the image.** </br>
   ```docker load -i <path to image tar file>``` </br>

### Docker-SSH
1. **Re-direct to remote environment.** </br>
```export DOCKER_HOST="ssh://username@remote-host"```

2. *OPTIONAL: Run a container. </br>
To prove that we are on remote-host, this will print its hostname.** </br>
```docker run --rm --net host busybox hostname -f```

3. **Build the image from current directory** </br>
```docker build -t iot-app-frontend .```

4. **Switch back to your local environment.** </br>
```unset DOCKER_HOST```

# Notes

- Folder structure according to [this](https://blog.webdevsimplified.com/2022-07/react-folder-structure/) article.
- **For local HTTPS only** in package.json:
    - for HTTPS: `"start": "export HTTPS=true&&SSL_CRT_FILE=cert.pem&&SSL_KEY_FILE=key.pem react-scripts start",`
    - for HTTP `"start": "react-scripts start",`
