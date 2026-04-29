+++
title= 'Fedora 42 Workstation con Hyprland & VFIO'
date= '2025-05-29'
description= 'guia de installation para fedora Linux workstation con Hyprland, KVM GPU passthrough, y Looking Glass.'
tags = ['fedora', 'hyprland', 'kvm', 'virtualization', 'linux', 'vfio' ]

+++

  

#  Configuracion de Fedora Workstation  

Aqui algunas de mis notas de mi Fedora 42 con entorno de videojuegos virtualizados con KVM. 
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

[https://github.com/mylinuxforwork/dotfiles/wiki/Installation](https://github.com/mylinuxforwork/dotfiles/wiki/Installation)

  

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
options vfio-pci ids=10de:2684,10de:22ba
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

5. Agregar parametros de kernel:
    

```
sudo nano /etc/default/grub
```

```
GRUB_CMDLINE_LINUX="rhgb amd_iommu=on iommu=pt vfio-pci.ids=10de:2684,10de:22ba modprobe.blacklist=nouveau"
```

6. Aplicar cambios:
    

```
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo dracut --force --kver $(uname -r)
sudo reboot
```

Despues de reinicio:

```
lspci -nnk -d 10de:2684  # Should show vfio-pci in use
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

📝  Puedes agregar mas , haciendo referencia a  [Hyprland wiki](https://wiki.hyprland.org/Configuring/Keybinds/) para ejecutar mas acciones.

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
Para crear tu VM con passthrough de GPU, usa el siguiente XML como plantilla. Guarda el XML como WindowsX.xml y luego impórtalo:
```bash
virsh define guindousdiez.xml
virsh start GuindousDiez
```

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
  <uuid>8e5f6520-a6e2-4717-9383-c5f26b1c3c79</uuid> <!-- UUID único -->

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

  <!-- Disco de la VM: asegúrate que /dev/sda sea el disco dedicado -->
  <devices>
    <disk type="block" device="disk">
      <driver name="qemu" type="raw" cache="none" io="native" discard="unmap"/>
      <source dev="/dev/sda"/>
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

    <!-- Looking Glass Shared Memory -->
    <qemu:commandline>
      <qemu:arg value="-object"/>
      <qemu:arg value="memory-backend-file,id=looking-glass,mem-path=/dev/kvmfr0,size=128M,share=yes"/>
      <qemu:arg value="-device"/>
      <qemu:arg value="ivshmem-plain,id=shmem0,memdev=looking-glass"/>
    </qemu:commandline>
  </devices>
</domain>
```



---
## **🔍 Enlaces utiles**

- [Hyprland Dotfiles + Install](https://github.com/mylinuxforwork/dotfiles/wiki/Installation)
    
- [Looking Glass Tutorial (YouTube)](https://www.youtube.com/watch?v=dxiX3E5B8bU)
    
- [KVM Gaming Optimization](https://blandmanstudios.medium.com/tutorial-the-ultimate-linux-laptop-for-pc-gamers-feat-kvm-and-vfio-dee521850385)
    

---



— Franco






