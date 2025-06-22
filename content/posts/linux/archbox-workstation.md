+++
title= 'Arch Linux Setup with VFIO GPU Passthrough'
date= '2025-06-22'
description= 'Using AMD iGPU for Host + NVIDIA RTX 4090 for VM (VFIO)'
tags = ['linux', 'arch']

+++

my notes and reference for using AMD iGPU for Host + NVIDIA RTX 4090 for VM (VFIO)

**System Specs:**

* **Motherboard**: Gigabyte B650 GAMING X AX
* **CPU**: AMD Ryzen 9 7950X3D (32 Threads)
* **GPU 1**: AMD iGPU (Raphael)
* **GPU 2**: NVIDIA GeForce RTX 4090 (VFIO Passthrough)
  <!--more-->

---

## BIOS Configuration

Before installing Arch, reboot into your BIOS and configure the following settings:

* **Enable**: `IOMMU` (sometimes called SVM or AMD-Vi)
* **Enable**: `ErP` (to reduce power consumption when off)
* **Disable**: `Secure Boot`
* **Disable**: `XMP` if you're facing memory instability
* **Set iGPU** as the primary display output
* **Disable**: Onboard **Bluetooth** and **Wi-Fi** (they can cause driver issues on Linux)

---

## Prepare Arch Installation

### 1. Boot from Arch ISO

In the terminal:

```bash
lsblk
```

Identify your installation drive (e.g., `/dev/nvme0n1`, `/dev/sda`). You can also use:

```bash
ls -l /dev/disk/by-id/
```

---

### 2. Start Chris Titus Arch Install

```bash
curl -fssl christitus.com/linux | sh
```

Then choose:

* `System Setup -> Arch Linux -> Arch Server Setup`
* Follow partitioning and installation prompts

Once installation finishes, **remove the USB** and reboot.

---

## First Boot Tasks

After reboot, the system will likely default to using the **NVIDIA GPU** for display. If this happens and you want to force it to use the iGPU:

1. Log in via **TTY** (if screen is black or blinking): use SSH instead:

```bash
ssh jfranco@<arch-ip>
```

2. Install basic tools:

```bash
sudo pacman -Syu nano openssh
sudo systemctl enable --now sshd
```

---

## 🛠️ Remove NVIDIA Host Drivers

Check what's installed:

```bash
pacman -Q | grep -i nvidia
```

For me, these were the ones I removed:

```bash
sudo pacman -Rns nvidia-utils nvidia-lts linux-firmware-nvidia
```

Only remove packages **actually listed** in your system, because we want that our host does not load nvidia card or software.

---

## ✨ VFIO Setup

### 1. Identify GPU IDs

```bash
lspci -nnk | grep -A3 NVIDIA
```

Example output:

```
01:00.0 VGA compatible controller: NVIDIA AD102 [GeForce RTX 4090] [10de:2684]
01:00.1 Audio device: NVIDIA Device [10de:22ba]
```

### 2. Blacklist NVIDIA

```bash
sudo nano /etc/modprobe.d/blacklist-nvidia.conf
```

```conf
blacklist nouveau
blacklist nvidia
blacklist nvidia_drm
blacklist nvidia_modeset
```

```bash
sudo nano /etc/modprobe.d/disable-nvidia.conf
```

```conf
install nvidia /bin/false
install nvidia_drm /bin/false
install nvidia_modeset /bin/false
```

### 3. Configure VFIO

```bash
sudo nano /etc/modprobe.d/vfio.conf
```

```conf
options vfio-pci ids=10de:2684,10de:22ba
```

### 4. Update Initramfs and GRUB

```bash
sudo nano /etc/default/grub
```

Edit:

```conf
GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3 amd_iommu=on iommu=pt vfio-pci.ids=10de:2684,10de:22ba"
```

```bash
sudo nano /etc/mkinitcpio.conf
```

```conf
MODULES=(vfio_pci vfio vfio_iommu_type1 amdgpu)
```

Then:

```bash
sudo mkinitcpio -P
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

---

## Enable AMD iGPU for X11

```bash
sudo pacman -Syu --needed mesa xf86-video-amdgpu xorg-server xorg-xinit --overwrite="*"
```

```bash
sudo mkdir -p /etc/X11/xorg.conf.d
sudo nano /etc/X11/xorg.conf.d/10-amdgpu.conf
sudo pacman -S mesa-utils
```

```conf
Section "Device"
    Identifier "AMD"
    Driver "amdgpu"
    BusID "PCI:11:0:0"
EndSection
```

> Use `lspci | grep VGA` to confirm the correct BusID for your iGPU

---

## 📂 Useful Debugging Commands

```bash
lsmod | grep amdgpu          # Check if amdgpu module is loaded
ls -l /dev/dri/              # Shows available DRM devices (card0 = active GPU)
lspci -nnk | grep -A3 NVIDIA # Check if vfio-pci is binding the 4090
```

---

## 🚀 Install Desktop Environment and Tools

Rerun:

```bash
curl -fssl christitus.com/linux | sh
```

Choose:

* `System Setup -> Arch Server Setup -> Virtualization`
* `Applications Setup -> dwm-titus, alacritty, zsh prompt, rofi, flatpak, firefox, neovim, vscode`

---

## ⌚ DWM-Titus Shortcuts

* ⌘ **Win + X** → Terminal
* ⌘ **Win + B** → Browser
* ⌘ **Win + R** → Rofi menu
* ⌘ **Win + T** → Toggle layout
* ⌘ **Win + J/K** → Focus window up/down
* ⌘ **Win + 1..5** → Switch workspaces
* ⌘ **Ctrl + Win + Q** → Power menu

---

## 💻 BONUS: Install Hyprland (JaKooLit Fork)

```bash
##auto clone and install
sh <(curl -L https://raw.githubusercontent.com/JaKooLit/Arch-Hyprland/main/auto-install.sh)
```

https://github.com/JaKooLit/Arch-Hyprland

