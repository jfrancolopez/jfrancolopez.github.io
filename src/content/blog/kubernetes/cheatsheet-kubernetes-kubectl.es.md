+++
title= 'Cheatsheet: Kubernetes with Talos Linux'
date= '2025-05-20'
description= 'Una referencia práctica de comandos kubectl adaptada a entornos con Talos Linux.'
tags = ['kubernetes', 'talos', 'cheatsheet', 'devops', 'homelab']
+++

Este es un resumen de referencia rápida que preparé para ayudarme a gestionar mis clústeres de Kubernetes con Talos Linux, tanto en casa como en el trabajo. Como `kubectl` es mi herramienta principal para las operaciones diarias, espero que esta guía también sea útil para otros que estén trabajando con configuraciones similares.
<!--more-->

## Información del Cluster

```bash
kubectl cluster-info          # Muestra información del endpoint del clúster
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

```bash
kubectl apply -f <file.yaml>    # Aplica una configuración
kubectl delete -f <file.yaml>   # Elimina recursos definidos en el archivo
```

## Acceso a Secrets y ConfigMaps

```bash
kubectl get secrets                # Lista los secrets
kubectl get secret <name> -o yaml # Ver secret completo
kubectl get configmap             # Lista los config maps
kubectl describe configmap <name> # Inspecciona un config map
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

```bash
kubectl delete pod <pod-name>    # Eliminar un pod dañado
kubectl delete svc <service>     # Eliminar un servicio
kubectl delete deployment <dep>  # Eliminar un deployment
```

## Aliases

Agrega estos alias a tu `.bashrc` o `.zshrc` para ahorrar tiempo:

```bash
alias k="kubectl"
alias kgp="kubectl get pods"
alias kaf="kubectl apply -f"
alias kdf="kubectl delete -f"
```

---

<div class="link-card">
  <a href="https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands" target="_blank">
    <strong>📘 Official kubectl Command Reference</strong><br>
    https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands
  </a>
</div>

--- 

Siempre me ha gustado hacer las cosas bien. Aunque puedes ejecutar Kubernetes en casi cualquier servidor, considero que Talos Linux ofrece una base excepcional: una plataforma segura, minimalista y diseñada específicamente para operar clústeres de Kubernetes.

-Franco
