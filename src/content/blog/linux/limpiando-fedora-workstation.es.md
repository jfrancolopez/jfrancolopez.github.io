+++
title= 'Limpiando Fedora Workstation '
date= '2025-05-20'
description= 'mantenimiento y limpieza de Fedora Workstation '
tags = ['fedora', 'linux', 'cleaning', 'maintenance', 'workstation' ]
+++

Después de meses de uso, pruebas de software y muchos ajustes, mi instalación de Fedora Workstation sigue siendo confiable y sólida.

Fedora se ha convertido en mi distribución preferida para desarrollo, productividad en escritorio y gaming. Usando Hyprland (en particular ML4W Hyprland), es rápida, moderna y sorprendentemente estable.
<!--more-->

---  

## Pruebas de Estrés

Aquí tienes una lista de experimentos y cambios que realicé en Fedora... y aun así, nunca tuve que reinstalar:

- Cambié entre varios entornos de escritorio (GNOME, KDE, Hyprland)
- Instalé y quité varios gestores de sesión (GDM, SDDM, sin DM)
- Probé GPU passthrough (VFIO) para máquinas virtuales de Windows con una NVIDIA RTX 4090
- Compilé y usé drivers personalizados de red y audio
- Lo usé como host de contenedores con Podman, Docker y Flatpaks
- Ejecuté múltiples LLMs locales y herramientas como Ollama para IA

A pesar de todo eso, Fedora nunca falló al arrancar, se corrompió, ni perdió datos.

  

---
  
## Rutina de Limpieza

Estas son las herramientas y pasos que uso para mantener Fedora ágil y rápido:

### Eliminar Flatpaks no utilizados

```bash
flatpak uninstall --unused #Elimina runtimes y versiones de apps que ya no se usan.
```

### **Limpiar la Caché de DNF**

```
sudo dnf clean all  #Libera espacio eliminando metadatos y paquetes antiguos.
```

---

### **Ver uso de disco con ncdu**  
Un analizador de uso de disco desde la terminal.

```bash
sudo dnf install ncdu
sudo ncdu /
```

---

### **Omitir puntos de montaje temporales**
Evita analizar volúmenes efímeros o montados.

```bash
sudo ncdu / --exclude /run --exclude /mnt --exclude /media
```

---

### **Limpiar /opt**

Aquí suelen vivir binarios y herramientas instaladas manualmente. Elimina lo que ya no uses.

---

### **Gestionar snapshots de Timeshift**
Timeshift es excelente.

```bash
timeshift-launcher               # Abrir la interfaz gráfica
sudo timeshift --list            # Ver snapshots existentes
sudo timeshift --delete --snapshot 'YYYY-MM-DD_HH-MM-SS'  # Borrar un snapshot específico
sudo timeshift --delete-all --keep 3                      # Conservar solo los 3 más recientes
```

---

### **Verificar uso del disco**

```bash
df -h       # Muestra uso por punto de montaje
lsblk       # Muestra estructura de particiones
```

---

### **Eliminar paquetes huérfanos**
Identifica y elimina paquetes que ya no se usan.

```bash
dnf repoquery --unsatisfied
sudo dnf autoremove
```

---

## **Limpiar logs del sistema**

```bash
sudo journalctl --vacuum-time=2weeks   #Libera espacio de logs más antiguos a dos semanas.
```

---
Después de  años usando distintos sistemas operativos, Fedora es mi estación de trabajo favorita y en la que más confío… limpia, rápida, segura y altamente personalizable.

Altamente recomendada.... Solo no olvides hacer limpieza de vez en cuando.

— Franco