<h1> IOT-App Frontend </h1>


<h2>Table of Contents</h2>

<!-- TOC -->
* [Overview](#overview)
  * [Key Features](#key-features)
  * [Technical Workflow](#technical-workflow)
    * [Technology Stack](#technology-stack)
  * [Setup and Deployment](#setup-and-deployment)
  * [Development and Testing](#development-and-testing)
  * [Project Structure](#project-structure)
* [Deployment to Raspberry Pi 3](#deployment-to-raspberry-pi-3)
  * [Prerequisites](#prerequisites)
  * [Network](#network)
    * [Certbot](#certbot)
  * [Build and file transfer](#build-and-file-transfer)
    * [SCP](#scp)
    * [Docker-SSH](#docker-ssh)
  * [Run](#run)
    * [Network](#network-1)
    * [Certbot](#certbot-1)
  * [Troubleshooting](#troubleshooting)
* [Notes](#notes)
<!-- TOC -->

# Overview
The IoT-App Frontend serves as an interactive interface for managing and monitoring IoT devices.
It's designed to provide users with real-time data visualization, control mechanisms and a comprehensive overview of their IoT devices.

## Key Features
- **User Interaction**: Users can log in, register, and manage their accounts. The authentication process ensures secure access to IoT device data.
- **Device Data Visualization**: The DataView component fetches data from connected IoT devices and displays it in an intuitive format. This could include real-time metrics, historical data analysis, or status reports of the devices.
- **Responsive UI for Various Devices**: Whether accessed from a desktop, tablet, or smartphone, the application adjusts its layout and controls for optimal user experience.
- **Role-Based Features**: Depending on the user's role (user, moderator, admin), different levels of access and control are provided, allowing for effective management and security.

## Technical Workflow
- **Data Handling**: The application uses Axios for efficient HTTP requests to fetch and send data to the backend, ensuring real-time updates and interactions with the IoT devices.
- **Routing and Navigation**: React Router is employed to manage navigation across different views and settings, providing a smooth and intuitive user experience.
- **Security and Performance**: The Dockerized environment, along with Nginx as a reverse proxy, ensures secure, scalable, and efficient performance, especially when deployed on a Raspberry Pi 3.
- **Testing and Quality Assurance**: Unit tests with React Testing Library ensure the reliability and stability of the application, while ESLint helps maintain high code quality standards.

### Technology Stack
- **React**: For building the user interface.
- **Bootstrap & React-Bootstrap**: For styling and responsive design.
- **Axios**: For making HTTP requests.
- **React Router**: For navigation within the application.
- **Docker**: For containerization and deployment.

## Setup and Deployment
- **Docker Support**: The project includes a `Dockerfile` and `docker-compose.yml` for containerization and easy deployment.
- **Nginx Configuration**: An `nginx.conf` file is provided for setting up Nginx as a reverse proxy server.
- **HTTPS Configuration**: Instructions in `package.json` for running the app in HTTPS mode using SSL certificates.

## Development and Testing
- **Unit Testing**: The project includes setup for unit testing with React Testing Library.
- **ESLint Configuration**: For maintaining code quality.

## Project Structure
- **Components**: Reusable components like headers, navigation bars, and UI elements.
- **Services**: Includes services for API calls, authentication, token management, and user services.
- **Pages**: React components representing different pages of the application.

---

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
It is configured to listen on port 80 and 443 for HTTP and HTTPS respectively. 
The traffic is then routed to the port 33 on which the react app runs.

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

Certbot is used to generate the SSL certificates for HTTPS. It accesses Let's Encrypt over the port 80 to generate the certificates.

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

## Build and file transfer

Transfer of other files like the `nginx.conf` or the `certbot` folder can be done with `scp` or like step 3.

### SCP

1. **Build on local machine.**
    ```bash
     docker build -t iot-app:front .
    ```

2. **Download the image from Docker.** </br>
   ```bash
    docker save -o /Users/dfurchert/Desktop/front-iot-image iot-app:front
   ```

3. **Copy the image to the remote host.** </br>
   ```bash
    scp -P 22 /Users/dfurchert/Desktop/front-iot-image dfurchert@192.168.1.156:/home/dfurchert/frontIotApp front-iot-image
    ```

4. **Load the image.** </br>
   ```bash 
   docker load -i /home/dfurchert/frontIotApp/front-iot-image
   ```

### Docker-SSH

1. **Re-direct to remote environment** </br>
    ```bash
    export DOCKER_HOST="ssh://username@remote-host"
    ```

2. **_OPTIONAL_ Run a container** </br>
To prove that we are on remote-host, this will print its hostname.
    ```bash
    docker run --rm --net host busybox hostname -f
    ```
   
3. **Build the image from current directory**
    ```bash
    docker build -t iot-app-frontend .
    ```

4. **Switch back to your local environment.**
    ```bash
    unset DOCKER_HOST
    ```

## Run

1. **Restart the containers.**
    ```bash
    docker-compose restart
    ```

**OR**

1. **Stop the containers.**
    ```bash
    docker-compose stop
    ```

   1. **Or Kill immediately the containers.**
       ```bash
       docker-compose kill
       ```

2. **Remove the containers.**
    ```bash
    docker-compose rm frontiotapp_nginx_1
    docker-compose rm frontiotapp_app_1
    ```

### Network

1. **Check the status of the firewall.**
    ```bash
    sudo ufw status
    ```
   
2. **Enable the firewall.**
    ```bash
    sudo ufw enable
    ```
   
3. **Allow the ports.**
    ```bash
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    ```
   
### Certbot

1. **Generate the certificates.**
    ```bash
    docker-compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d furchert.ch
    ```

2. **Renew the certificates.**
    ```bash
    docker-compose -f exec nginx nginx -s reload
    ```   

## Troubleshooting

- **Logs**
    ```bash
    docker logs frontiotapp_nginx_1
    docker logs frontiotapp_app_1
    ```

---

# Notes

- Folder structure according to [this](https://blog.webdevsimplified.com/2022-07/react-folder-structure/) article.
- **For local HTTPS only** in package.json:
    - for HTTPS: `"start": "export HTTPS=true&&SSL_CRT_FILE=cert.pem&&SSL_KEY_FILE=key.pem react-scripts start",`
    - for HTTP `"start": "react-scripts start",`
