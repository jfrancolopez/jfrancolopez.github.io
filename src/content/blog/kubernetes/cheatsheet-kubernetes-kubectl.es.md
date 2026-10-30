+++
title= 'Cheatsheet: Kubernetes with Talos Linux'
date= '2025-05-20'
description= 'Una referencia práctica de comandos kubectl adaptada a entornos con Talos Linux.'
tags = ['kubernetes', 'talos', 'cheatsheet', 'devops', 'homelab']
+++

Este es un resumen de referencia rápida que preparé para ayudarme a gestionar mis clústeres de Kubernetes con Talos Linux, tanto en casa como en el trabajo. Como `kubectl` es mi herramienta principal para las operaciones diarias, espero que esta guía también sea útil para otros que estén trabajando con configuraciones similares.

Antes de aplicar o eliminar recursos, verifica el contexto y namespace actuales. Los valores
de un Secret solo están codificados en base64; no compartas su salida en tickets, logs o
terminales compartidas.
<!--more-->

## Información del Cluster

```bash
kubectl cluster-info          # Muestra información del endpoint del clúster
kubectl config current-context # Confirma el clúster objetivo
kubectl get nodes             # Lista todos los nodos
kubectl describe node <name>  # Información detallada de un nodo específico
```

## Workloads (Cargas de trabajo)

```bash
kubectl get pods                      # Todos los pods en el namespace actual
kubectl get pods -A                  # Todos los pods en todos los namespaces
kubectl describe pod <pod-name>     # Inspeccionar un pod en detalle
kubectl logs <pod-name>             # Ver logs de un pod
kubectl logs -f <pod-name>          # Seguir logs en tiempo real
kubectl exec -it <pod-name> -- bash # Abrir una terminal en el contenedor (si bash está disponible)
```

## Deployments (Desarrollos) y Servicios

```bash
kubectl get deployments              # Lista los deployments
kubectl describe deployment <name>  # Inspecciona un deployment
kubectl rollout restart deployment <name>  # Reinicia el deployment

kubectl get svc                      # Lista los servicios
kubectl describe svc <name>         # Detalles del servicio
```

## Aplicar y Eliminar YAML

Revisa el diff primero y especifica el namespace. Los comandos de eliminación actúan de inmediato.

```bash
kubectl diff -f FILE.yaml -n NAMESPACE    # Vista previa de cambios
kubectl apply -f FILE.yaml -n NAMESPACE   # Aplica una configuración
kubectl delete -f FILE.yaml -n NAMESPACE  # Elimina recursos del archivo
```

## Inspeccionar Secrets y ConfigMaps

```bash
kubectl get secrets -n NAMESPACE              # Lista metadatos de secrets
kubectl describe secret NAME -n NAMESPACE     # Muestra claves, no valores
kubectl get configmap -n NAMESPACE            # Lista config maps
kubectl describe configmap NAME -n NAMESPACE  # Inspecciona un config map
```

## Herramientas de Prueba

```bash
kubectl run tmp-shell --rm -i --tty --image=alpine -- sh
# Inicia un pod temporal con Alpine para pruebas rápidas o ejecutar hello world
```

## Consejos Específicos para Talos

Aunque Talos no permite conexiones SSH, puedes usar `talosctl` para interactuar directamente:

```bash
talosctl kubeconfig               # Obtener el kubeconfig desde Talos
kubectl get nodes                 # Confirmar la comunicación con el clúster
```

## Limpieza

Confirma `kubectl config current-context` y el namespace antes de ejecutar estos comandos.

```bash
kubectl delete pod POD_NAME -n NAMESPACE          # Eliminar un pod dañado
kubectl delete svc SERVICE_NAME -n NAMESPACE      # Eliminar un servicio
kubectl delete deployment DEPLOYMENT -n NAMESPACE # Eliminar un deployment
```

## Aliases

Agrega estos alias a tu `.bashrc` o `.zshrc` para ahorrar tiempo:

```bash
alias k="kubectl"
alias kgp="kubectl get pods"
alias kaf="kubectl apply -f"
alias kdiff="kubectl diff -f"
```

---

<div class="link-card">
  <a href="https://kubernetes.io/docs/reference/kubectl/generated/" target="_blank" rel="noopener noreferrer">
    <strong>📘 Official kubectl Command Reference</strong><br>
    https://kubernetes.io/docs/reference/kubectl/generated/
  </a>
</div>

--- 

Siempre me ha gustado hacer las cosas bien. Aunque puedes ejecutar Kubernetes en casi cualquier servidor, considero que Talos Linux ofrece una base excepcional: una plataforma segura, minimalista y diseñada específicamente para operar clústeres de Kubernetes.

-Franco
