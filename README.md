# IOT-App Frontend

Folder structure according to [this](https://blog.webdevsimplified.com/2022-07/react-folder-structure/) article.

## Important

in package.json:
- for HTTPS: `"start": "export HTTPS=true&&SSL_CRT_FILE=cert.pem&&SSL_KEY_FILE=key.pem react-scripts start",`
- for HTTP `"start": "react-scripts start",`


# Deployment

## To Raspberry pi Docker via SSH from local machine
**Re-direct to remote environment.** </br>
export DOCKER_HOST="ssh://username@remote-host"

**Run a container. To prove that we are on remote-host, this will print its hostname.** </br>
docker run --rm --net host busybox hostname -f

**Build the image.** </br>
docker build -t iot-app-frontend .

**Switch back to your local environment.** </br>
unset DOCKER_HOST

## To Raspberry pi Docker via SCP from local machine
**Download the image from Docker.** </br>
docker save -o <path for generated tar file> <image name>

**Copy the image to the remote host.** </br>
scp <path for generated tar file> username@remote-host:<path for remote directory> </br>
scp front-iot-image dfurchert@192.168.1.156:/home/dfurchert/frontIotApp

**Load the image.** </br>
docker load -i <path to image tar file>

