+++
title= 'Cheatsheet: Docker CLI'
date= '2025-05-21'
description= 'comandos esenciales de Docker '
tags = ['docker', 'cheatsheet', 'containers', 'devops', 'linux']
+++

Algunas notas y referencias para los comandos comunes de Docker, organizados en secciones. Nada especial, simple.
<!--more-->

---

## Ejecutar Contenedores

```bash
# Ejecutar un contenedor desde una imagen
docker run IMAGE

# Ejecutar y nombrar el contenedor
docker run --name web nginx

# Mapear puertos (host:contenedor)
docker run -p 8080:80 nginx

# Exponer todos los puertos del contenedor
docker run -P nginx

# Ejecutar en modo desapegado (background)
docker run -d nginx

# Asignar un hostname personalizado
docker run --hostname myhost nginx

# Agregar una entrada DNS personalizada
docker run --add-host internal.local:10.0.0.5 nginx

# Montar un directorio local en el contenedor
docker run -v ~/site:/usr/share/nginx/html nginx

# Sobrescribir entrypoint
docker run --entrypoint bash nginx

# Iniciar con una shell interactiva
docker run -it ubuntu bash
```

---

## Administrar Contenedores

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Detener un contenedor
docker stop CONTAINER

# Iniciar un contenedor
docker start CONTAINER

# Reiniciar un contenedor
docker restart CONTAINER

# Eliminar un contenedor
docker rm CONTAINER

# Eliminar forzadamente
docker rm -f CONTAINER

# Eliminar todos los contenedores detenidos
docker container prune

# Renombrar un contenedor
docker rename OLD_NAME NEW_NAME
```

---

## Copiar Archivos

```bash
# Del contenedor al host
docker cp web:/index.html ./index.html

# Del host al contenedor
docker cp ./file.txt web:/data/file.txt
```

---

## Inspección y Logs

```bash
# Ver logs del contenedor
docker logs CONTAINER

# Seguir logs en tiempo real
docker logs -f CONTAINER

# Estadísticas del contenedor
docker stats

# Procesos dentro del contenedor
docker top CONTAINER

# Inspeccionar metadatos de contenedor o imagen
docker inspect nginx

# Mostrar archivos modificados
docker diff CONTAINER

# Ver puertos expuestos
docker port CONTAINER
```

---

## Comandos en Contenedores

```bash
# Ejecutar un comando en un contenedor en ejecución
docker exec CONTAINER COMMAND

# Iniciar una shell interactiva
docker exec -it CONTAINER bash
```

---

## Administrar Imágenes

```bash
# Listar imágenes locales
docker images

# Descargar una imagen
docker pull ubuntu:latest

# Subir una imagen al repositorio
docker push myuser/myimage:tag

# Eliminar una imagen
docker rmi IMAGE

# Eliminar imágenes colgantes (dangling)
docker image prune

# Eliminar imágenes no utilizadas
docker image prune -a

# Construir una imagen desde Dockerfile
docker build -t myimage .

# Etiquetar una imagen
docker tag IMAGE NEW_NAME

# Guardar imagen a archivo tar
docker save nginx > nginx.tar

# Cargar imagen desde archivo tar
docker load -i nginx.tar
```

---

## Volúmenes en Docker

```bash
# Listar volúmenes
docker volume ls

# Crear un volumen
docker volume create mydata

# Inspeccionar un volumen
docker volume inspect mydata

# Eliminar un volumen
docker volume rm mydata

# Eliminar todos los volúmenes no utilizados
docker volume prune
```

---

## Redes en Docker

```bash
# Listar redes
docker network ls

# Crear red tipo bridge
docker network create mynet

# Conectar contenedor a red
docker network connect mynet CONTAINER

# Desconectar contenedor
docker network disconnect mynet CONTAINER

# Inspeccionar red
docker network inspect mynet
```

---

## Limpieza del Sistema

```bash
# Eliminar contenedores, redes e imágenes no usadas (no volúmenes)
docker system prune

# Eliminar todo, incluyendo volúmenes
docker system prune -a --volumes
```

---

Esto ha sido útil como referencia rápida en entornos de desarrollo como en producción.

— Franco