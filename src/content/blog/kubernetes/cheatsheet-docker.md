+++
title= 'Cheatsheet: Docker CLI'
date= '2025-05-21'
description= 'my essential Docker CLI commands '
tags = ['docker', 'cheatsheet', 'containers', 'devops', 'linux']
+++

my notes and reference for common Docker commands, organized by task. Nothing crazy, just useful.
<!--more-->

---

## Run New Containers

```bash
# Run a container from an image
docker run IMAGE

# Run and name the container
docker run --name web nginx

# Map ports (host:container)
docker run -p 8080:80 nginx

# Expose all container ports
docker run -P nginx

# Run in detached mode (background)
docker run -d nginx

# Assign a custom hostname
docker run --hostname myhost nginx

# Add a custom DNS entry
docker run --add-host internal.local:10.0.0.5 nginx

# Mount a local directory into the container
docker run -v ~/site:/usr/share/nginx/html nginx

# Override entrypoint
docker run --entrypoint bash nginx

# Start with interactive shell
docker run -it ubuntu bash
```

---

## Manage Containers

```bash
# Show running containers
docker ps

# Show all containers
docker ps -a

# Stop a container
docker stop CONTAINER

# Start a container
docker start CONTAINER

# Restart a container
docker restart CONTAINER

# Remove a container
docker rm CONTAINER

# Remove forcibly
docker rm -f CONTAINER

# Remove all stopped containers
docker container prune

# Rename a container
docker rename OLD_NAME NEW_NAME
```

---

## Copy Files

```bash
# From container to host
docker cp web:/index.html ./index.html

# From host to container
docker cp ./file.txt web:/data/file.txt
```

---

## Inspect & Logs

```bash
# Show container logs
docker logs CONTAINER

# Follow logs live
docker logs -f CONTAINER

# Container stats
docker stats

# Top processes inside container
docker top CONTAINER

# Inspect container or image metadata
docker inspect nginx

# Show changed files
docker diff CONTAINER

# Show exposed ports
docker port CONTAINER
```

---

## Execute in Containers

```bash
# Run a command in a running container
docker exec CONTAINER COMMAND

# Start an interactive shell
docker exec -it CONTAINER bash
```

---

## Manage Images

```bash
# List local images
docker images

# Pull an image
docker pull ubuntu:latest

# Push an image
docker push myuser/myimage:tag

# Remove an image
docker rmi IMAGE

# Remove dangling images
docker image prune

# Remove unused images
docker image prune -a

# Build image from Dockerfile
docker build -t myimage .

# Tag an image
docker tag IMAGE NEW_NAME

# Save image to tar
docker save nginx > nginx.tar

# Load image from tar
docker load -i nginx.tar
```

---

## Docker Volumes

```bash
# List volumes
docker volume ls

# Create a volume
docker volume create mydata

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Remove all unused volumes
docker volume prune
```

---

## Docker Networks

```bash
# List networks
docker network ls

# Create a bridge network
docker network create mynet

# Connect container to network
docker network connect mynet CONTAINER

# Disconnect container
docker network disconnect mynet CONTAINER

# Inspect network
docker network inspect mynet
```

---

## System Cleanup

```bash
# Remove unused containers, networks, images (not volumes)
docker system prune

# Remove everything, including volumes
docker system prune -a --volumes
```

---

this has been handy for me as a fast reference in development or production environments.

— Franco