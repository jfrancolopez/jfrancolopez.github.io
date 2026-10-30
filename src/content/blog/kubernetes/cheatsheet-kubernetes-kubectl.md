+++
title= 'Cheatsheet: Kubernetes with Talos Linux'
date= '2025-05-20'
description= 'A practical kubectl command reference tailored for Talos Linux environments.'
tags = ['kubernetes', 'talos', 'cheatsheet', 'devops', 'homelab']
+++

Here’s a quick reference guide I put together to help manage my Talos Linux Kubernetes clusters... both at home and at work. Since `kubectl` is my main tool for daily operations, I hope this guide also proves useful to others navigating similar setups.

Before applying or deleting anything, verify the current context and namespace. Kubernetes
Secret values are only base64-encoded, not encrypted for display; do not paste their output
into tickets, logs, or shared terminals.
<!--more-->

##  Cluster Info

```bash
kubectl cluster-info          # Display cluster endpoint info
kubectl config current-context # Confirm the target cluster
kubectl get nodes             # List all nodes
kubectl describe node <name>  # Detailed info on a specific node
```

## Workloads

```bash
kubectl get pods                      # All pods in current namespace
kubectl get pods -A                  # All pods across all namespaces
kubectl describe pod <pod-name>     # Inspect a pod in detail
kubectl logs <pod-name>             # View logs from a pod
kubectl logs -f <pod-name>          # Follow logs (streaming)
kubectl exec -it <pod-name> -- bash # Open shell into a container (if bash is available)
```

##  Deployments & Services

```bash
kubectl get deployments              # List deployments
kubectl describe deployment <name>  # Inspect a deployment
kubectl rollout restart deployment <name>  # Restart deployment

kubectl get svc                      # List services
kubectl describe svc <name>         # Service details
```

## YAML Apply & Delete

Review the diff first, then specify the intended namespace. Delete commands act immediately.

```bash
kubectl diff -f FILE.yaml -n NAMESPACE    # Preview changes
kubectl apply -f FILE.yaml -n NAMESPACE   # Apply configuration
kubectl delete -f FILE.yaml -n NAMESPACE  # Delete resources from file
```

## Inspect Secrets & ConfigMaps

```bash
kubectl get secrets -n NAMESPACE              # List secret metadata
kubectl describe secret NAME -n NAMESPACE     # Show keys, not values
kubectl get configmap -n NAMESPACE            # List config maps
kubectl describe configmap NAME -n NAMESPACE  # Inspect a config map
```

## Testing Tools

```bash
kubectl run tmp-shell --rm -i --tty --image=alpine -- sh
# Start a temporary alpine pod for quick tests or run hello world pod
```

## Talos Specific Tips

While Talos doesn't support SSH, you can use `talosctl` to interact directly:

```bash
talosctl kubeconfig               # Grab kubeconfig from Talos
kubectl get nodes                 # Confirm communication with cluster
```

## Cleanup Helpers

Confirm `kubectl config current-context` and the namespace before running these commands.

```bash
kubectl delete pod POD_NAME -n NAMESPACE         # Delete a broken pod
kubectl delete svc SERVICE_NAME -n NAMESPACE     # Remove a service
kubectl delete deployment DEPLOYMENT -n NAMESPACE # Remove a deployment
```

##  Aliases

Set these in your `.bashrc` or `.zshrc` to save time:

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


I’ve always been someone who values doing things the right way. While you can run Kubernetes on almost any server, I believe Talos Linux provides an exceptional foundation — offering a secure, minimal, and purpose-built platform for running Kubernetes clusters. 

-Franco
