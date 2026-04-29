+++
title= 'Fedora 42 Workstation with Hyprland & VFIO'
date= '2025-05-29'
description= 'setup guide for a Linux workstation with Hyprland, KVM GPU passthrough, and Looking Glass.'
tags = ['fedora', 'hyprland', 'kvm', 'virtualization', 'linux', 'vfio' ]

+++

  

#  Fedora Workstation Setup 

Here are some of my notes for my Fedora 42 workstation and VM gaming environment. Happy hacking!
<!--more-->
- System updated
    
- Installed Hyprland & SDDM
    
- GPU passthrough with VFIO
    
- KVM + QEMU + Looking Glass
    
- Kitty terminal with copy on select
    
- Installed core apps (WhatsApp, Spotify, VSCode, VLC, Thunderbird)
    
- Timeshift backup system
    
- Hugepages for VM performance
    
- Flatpak + productivity apps
    
- Add full theme customization
    
- Create automation scripts
    
- Setup SSH, GPG keys, and Git
    
- Add container runtimes (Podman, Docker)
    

---

##  System Update & Basic Apps

```
sudo dnf update
```

Installed with Flatpak:

```
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.discordapp.Discord
flatpak install flathub com.spotify.Client
flatpak install flathub com.visualstudio.code
flatpak install flathub org.videolan.VLC
flatpak install flathub org.mozilla.Thunderbird
```

---

## Hyprland & SDDM Setup

  

Followed:

[https://github.com/mylinuxforwork/dotfiles/wiki/Installation](https://github.com/mylinuxforwork/dotfiles/wiki/Installation)

  

Installed sddm, enabled it, and restarted:

```
sudo dnf install sddm
sudo systemctl enable sddm
sudo reboot
```

---

## Kitty Terminal Customization

  

Make selection auto-copy to clipboard:

```
~/.config/kitty/kitty.conf
copy_on_select yes
clipboard_control write-clipboard write-primary
```

---

## VFIO GPU Passthrough Setup (NVIDIA 4090)

  

### **Steps:**

1. Identify GPU IDs:
    

```
lspci -nn | grep -E "NVIDIA"
```

2. Create VFIO config:
    

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

4. Add VFIO to initramfs:
    

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

5. Add kernel parameters:
    

```
sudo nano /etc/default/grub
```

```
GRUB_CMDLINE_LINUX="rhgb amd_iommu=on iommu=pt vfio-pci.ids=10de:2684,10de:22ba modprobe.blacklist=nouveau"
```

6. Apply changes:
    

```
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo dracut --force --kver $(uname -r)
sudo reboot
```

After reboot:

```
lspci -nnk -d 10de:2684  # Should show vfio-pci in use
```

---

##  Hyprland Keybindings (Detailed)

  

Edit:

```
nano ~/.config/hypr/conf/keybindings/default.conf
```

### **Keybinding Examples:**

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

📝 You can add more by referencing the [Hyprland wiki](https://wiki.hyprland.org/Configuring/Keybinds/) for actions like workspace switching, tiling, moving windows, etc.

---

## Timeshift

  

Install Timeshift to enable system snapshot backups:

```
sudo dnf install timeshift
```

---

## Virtualization & Looking Glass Setup

  

Install full virtualization stack:

```
sudo dnf group install virtualization
sudo dnf install virt-manager virt-install libvirt-daemon-config-network qemu-kvm bridge-utils edk2-ovmf spice-server spice-gtk
sudo systemctl enable --now libvirtd
```

Enable GUI permissions:

```
sudo dnf install lxqt-policykit
```

Reload Hyprland config with agent:

```
nano ~/.config/hypr/scripts/loadconfig.sh
```

```
#!/bin/bash
hyprctl reload
/usr/libexec/lxqt-policykit-agent &
```

And in ~/.config/hypr/hyprland.conf:

```
exec-once = ~/.config/hypr/scripts/loadconfig.sh
```

---

## **🔍 Useful Links**

- [Hyprland Dotfiles + Install](https://github.com/mylinuxforwork/dotfiles/wiki/Installation)
    
- [Looking Glass Tutorial (YouTube)](https://www.youtube.com/watch?v=dxiX3E5B8bU)
    
- [KVM Gaming Optimization](https://blandmanstudios.medium.com/tutorial-the-ultimate-linux-laptop-for-pc-gamers-feat-kvm-and-vfio-dee521850385)
    

---



— Franco