+++
title= 'Fedora 42 Workstation con Hyprland y VFIO'
date= '2025-05-29'
description= 'Guía de instalación de una estación de trabajo Fedora con Hyprland, KVM GPU passthrough y Looking Glass.'
tags = ['fedora', 'hyprland', 'kvm', 'virtualization', 'linux', 'vfio' ]

+++

Estas son algunas notas de mi estación de trabajo Fedora 42 con un entorno de videojuegos virtualizado con KVM.

> **Configuración específica del equipo y potencialmente destructiva:** No copies los
> valores VFIO literalmente. Confirma que el host usa otra GPU, reemplaza cada ID con los
> de tu equipo, respalda la configuración de arranque y prepara un medio de recuperación
> antes de reconstruir el initramfs.
<!--more-->

- Actualizacion del sistema
    
- Instalacion de Hyprland & SDDM
    
- GPU passthrough con VFIO
    
- KVM + QEMU + Looking Glass
    
- Kitty terminal con copiado y pegado al seleccionar
    
- Aplicaciones esenciales (WhatsApp, Spotify, VSCode, VLC, Thunderbird)
    
- Timeshift sistema de backup 
    
- Hugepages para rendimiento de VM 
    
- Flatpak + applicaciones de productividad
    
- Personalizacion del tema
    
- Scripts de automatizacion
    
- configuacion de SSH, GPG keys, y Git
    
- Contenedores (Podman, Docker)
    

---

##  Actualizacion del sistema

```
sudo dnf update
```

instalacion con Flatpak:

```
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.discordapp.Discord
flatpak install flathub com.spotify.Client
flatpak install flathub com.visualstudio.code
flatpak install flathub org.videolan.VLC
flatpak install flathub org.mozilla.Thunderbird
```

---

## Hyprland & SDDM 

  

seguido por:

[https://ml4w.com/os/](https://ml4w.com/os/)

  

instalar sddm, habilitarlo, y reiniciar:

```
sudo dnf install sddm
sudo systemctl enable sddm
sudo reboot
```

---

## Personalizacion de Kitty Terminal 

  

Al seleccionar-> auto-copy to clipboard:

```
~/.config/kitty/kitty.conf
copy_on_select yes
clipboard_control write-clipboard write-primary
```

---

## VFIO GPU Passthrough Setup (NVIDIA 4090)

  

### Pasos:

1. Identifica tu GPU IDs:
    

```
lspci -nn | grep -E "NVIDIA"
```

2. Crear VFIO config:
    

```
sudo nano /etc/modprobe.d/vfio.conf
```

```
options vfio-pci ids=VENDOR_ID:DEVICE_ID,AUDIO_VENDOR_ID:AUDIO_DEVICE_ID
softdep nvidia pre: vfio-pci
```

3. Blacklist Nouveau:
    

```
sudo nano /etc/modprobe.d/blacklist-nouveau.conf
```

```
blacklist nouveau
options nouveau modeset=0
```

4. Agregar VFIO a initramfs:
    

```
sudo mkdir -p /etc/dracut.conf.d
sudo nano /etc/dracut.conf.d/vfio.conf
```

```
add_drivers+=" vfio vfio_iommu_type1 vfio_pci "
force_drivers+=" vfio_pci "
omit_drivers+=" nouveau "
install_items+=" /etc/modprobe.d/vfio.conf /etc/modprobe.d/blacklist-nouveau.conf "
```

5. Respalda la configuración y agrega los parámetros VFIO al valor existente de
   `GRUB_CMDLINE_LINUX`. Conserva los argumentos actuales de root, LUKS, resume y los
   demás valores específicos del equipo. En Intel usa `intel_iommu=on` en lugar de
   `amd_iommu=on`.
    

```
sudo cp --archive /etc/default/grub /etc/default/grub.before-vfio
sudo nano /etc/default/grub
```

```
amd_iommu=on iommu=pt vfio-pci.ids=VENDOR_ID:DEVICE_ID,AUDIO_VENDOR_ID:AUDIO_DEVICE_ID modprobe.blacklist=nouveau
```

6. Aplicar cambios:
    

```
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo dracut --force --kver $(uname -r)
```

Revisa la configuración generada antes de reiniciar. Si la GPU seleccionada controla la
pantalla del host o los IDs son incorrectos, el próximo arranque puede quedarse sin video;
restaura el respaldo de GRUB y la configuración VFIO desde una consola o un entorno live.

```bash
sudo reboot
```

Despues de reinicio:

```
lspci -nnk -d VENDOR_ID:DEVICE_ID  # Debe mostrar vfio-pci en uso
```

---

##  Hyprland Keybindings (Detallado)

  

Editar:

```
nano ~/.config/hypr/conf/keybindings/default.conf
```

### Ejemplos de configuacion:

```
# Launch app launcher (Rofi)
bind = $mainMod, SPACE, exec, sh -c 'pkill rofi || rofi -show drun -replace -i'

# Reload Hyprland config
bind = $mainMod, R, exec, hyprctl reload

# Lock screen
bind = $mainMod, L, exec, swaylock

# Launch terminal
bind = $mainMod, RETURN, exec, kitty

# Close focused window
bind = $mainMod, Q, killactive
```

Puedes agregar más acciones consultando la [documentación de atajos de Hyprland](https://wiki.hypr.land/configuring/core/binds/).

---

## Timeshift

  

Instala Timeshift para habilitar los snapshots del sistema

```
sudo dnf install timeshift
```

---

## Virtualization & Looking Glass 

  

Instalacion:

```
sudo dnf group install virtualization
sudo dnf install virt-manager virt-install libvirt-daemon-config-network qemu-kvm bridge-utils edk2-ovmf spice-server spice-gtk
sudo systemctl enable --now libvirtd
```

Habilita permisos de GUI:

```
sudo dnf install lxqt-policykit
```

Recarga Hyprland config con agente:

```
nano ~/.config/hypr/scripts/loadconfig.sh
```

```
#!/bin/bash
hyprctl reload
/usr/libexec/lxqt-policykit-agent &
```

y en  ~/.config/hypr/hyprland.conf:

```
exec-once = ~/.config/hypr/scripts/loadconfig.sh
```

---

## Máquina Virtual Windows (XML QEMU)
Este es un fragmento ilustrativo de aquella VM, no una definición completa lista para
importar. Crea primero una VM con `virt-manager`, exporta su XML y adapta únicamente las
secciones necesarias. Revisa todos los dispositivos y rutas antes de definir o iniciar el
dominio; una dirección PCI incorrecta puede desconectar hardware que usa el host.

Incluye:

* Hugepages activados

* Memoria bloqueada y no compartida

* CPU topology detallada

* Q35 machine type con UEFI

* Looking Glass con IVSHMEM

XML:
```xml
<domain xmlns:qemu="http://libvirt.org/schemas/domain/qemu/1.0" type="kvm">
  <name>GuindousDiez</name> <!-- Nombre personalizado de la VM -->

  <metadata>
    <libosinfo:libosinfo xmlns:libosinfo="http://libosinfo.org/xmlns/libvirt/domain/1.0">
      <libosinfo:os id="http://microsoft.com/win/10"/> <!-- Detectar como Windows 10 -->
    </libosinfo:libosinfo>
  </metadata>

  <!-- Memoria RAM: 32 GB con hugepages activadas para mejorar rendimiento -->
  <memory unit="KiB">33554432</memory>
  <currentMemory unit="KiB">33554432</currentMemory>
  <memoryBacking>
    <hugepages/>
    <nosharepages/>
    <locked/>
  </memoryBacking>

  <vcpu placement="static">12</vcpu> <!-- 12 hilos para la VM -->

  <!-- Arranque con UEFI (requerido para Windows moderno + passthrough) -->
  <os firmware="efi">
    <type arch="x86_64" machine="pc-q35-9.2">hvm</type>
    <firmware>
      <feature enabled="no" name="enrolled-keys"/>
      <feature enabled="no" name="secure-boot"/>
    </firmware>
    <loader readonly="yes" type="pflash" format="qcow2">/usr/share/edk2/ovmf/OVMF_CODE_4M.qcow2</loader>
    <nvram template="/usr/share/edk2/ovmf/OVMF_VARS_4M.qcow2" templateFormat="qcow2" format="qcow2">/var/lib/libvirt/qemu/nvram/GuindousDiez_VARS.qcow2</nvram>
    <boot dev="hd"/>
  </os>

  <!-- Opciones de virtualización de Hyper-V necesarias para Windows -->
  <features>
    <acpi/>
    <apic/>
    <hyperv mode="custom">
      <relaxed state="on"/>
      <vapic state="on"/>
      <spinlocks state="on" retries="8191"/>
      <vpindex state="on"/>
      <runtime state="on"/>
      <synic state="on"/>
      <stimer state="on"/>
      <reset state="on"/>
      <vendor_id state="on" value="randomid"/>
      <frequencies state="on"/>
      <tlbflush state="on"/>
      <ipi state="on"/>
      <avic state="on"/>
    </hyperv>
    <vmport state="off"/>
  </features>

  <!-- Passthrough completo del CPU del host -->
  <cpu mode="host-passthrough" check="none" migratable="on">
    <topology sockets="1" dies="1" clusters="1" cores="6" threads="2"/>
    <cache mode="passthrough"/>
    <feature policy="require" name="topoext"/>
  </cpu>

  <clock offset="localtime">...</clock>

  <!-- Usa una imagen de VM por defecto; no expongas un disco del host como /dev/sda -->
  <devices>
    <disk type="file" device="disk">
      <driver name="qemu" type="qcow2" cache="none"/>
      <source file="/var/lib/libvirt/images/WindowsX.qcow2"/>
      <target dev="sda" bus="sata"/>
    </disk>

    <!-- CD-ROM con ISO instalador de Windows -->
    <disk type="file" device="cdrom">
      <driver name="qemu" type="raw"/>
      <source file="/path/to/windows.iso"/> <!-- <-- CAMBIA AQUÍ -->
      <target dev="sdb" bus="sata"/>
      <readonly/>
    </disk>

    <!-- GPU Passthrough: Asegúrate de que las direcciones PCI coincidan con tu GPU -->
    <hostdev mode="subsystem" type="pci" managed="yes">
      <source>
        <address domain="0x0000" bus="0x01" slot="0x00" function="0x0"/>
      </source>
    </hostdev>
    <hostdev mode="subsystem" type="pci" managed="yes">
      <source>
        <address domain="0x0000" bus="0x01" slot="0x00" function="0x1"/>
      </source>
    </hostdev>

  </devices>

  <!-- Looking Glass Shared Memory -->
  <qemu:commandline>
    <qemu:arg value="-object"/>
    <qemu:arg value="memory-backend-file,id=looking-glass,mem-path=/dev/kvmfr0,size=128M,share=yes"/>
    <qemu:arg value="-device"/>
    <qemu:arg value="ivshmem-plain,id=shmem0,memdev=looking-glass"/>
  </qemu:commandline>
</domain>
```

Si necesitas passthrough de un disco físico, usa una ruta estable bajo `/dev/disk/by-id/`,
confirma varias veces que no sea el disco del host, desmonta todas sus particiones y evita
que el host las monte automáticamente. El disco debe pertenecer exclusivamente a la VM
mientras esta se ejecuta; nunca permitas escrituras simultáneas del host y el invitado.
Mantén un respaldo verificado, valida el XML y revisa `virsh domblklist GuindousDiez` antes
de iniciar la VM.



---
## **🔍 Enlaces utiles**

- [Entorno de escritorio ML4W](https://ml4w.com/os/)
    
- [Looking Glass Tutorial (YouTube)](https://www.youtube.com/watch?v=dxiX3E5B8bU)
    
- [KVM Gaming Optimization](https://blandmanstudios.medium.com/tutorial-the-ultimate-linux-laptop-for-pc-gamers-feat-kvm-and-vfio-dee521850385)
    

---



— Franco

