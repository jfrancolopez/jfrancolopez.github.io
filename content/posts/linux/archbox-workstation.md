+++
title= 'Arch Linux Setup with VFIO GPU Passthrough'
date= '2025-06-22'
description= 'Using AMD iGPU for Host + NVIDIA RTX 4090 for VM (VFIO)'
tags = ['linux', 'arch', 'vfio', 'hyprland']


+++

my notes and reference for using AMD iGPU for Host + NVIDIA RTX 4090 for VM (VFIO)

**System Specs:**

* **Motherboard**: Gigabyte B650 GAMING X AX (rev. 1.3)
* **CPU**: AMD Ryzen 9 7950X3D (32 Threads)
* **GPU 1 (Host)**: AMD iGPU (Raphael, RDNA2)
* **GPU 2 (Passthrough/Optional Host)**: NVIDIA GeForce RTX 4090
* **Memory**: Corsair Vengeance DDR5 64GB (2×32GB) 5600 MHz CL40 (XMP, CMK64GX5M2B5600C40)
* **OS**: Arch Linux (Hyprland) + Windows 11 Pro (separate disk)
  <!--more-->

---

## BIOS Configuration

Before installing Arch, reboot into your BIOS and configure the following settings:

* **Enable**: `IOMMU` (sometimes called SVM or AMD-Vi)
* **Enable**: `ErP` (to reduce power consumption when off)
* **Disable**: `Secure Boot`
* **Disable**: `XMP` if you're facing memory instability
* 


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

### 2. Chris Titus Arch Install (optional fast setup)

```bash
curl -fssl christitus.com/linux | sh
```

Then choose:

* `System Setup -> Arch Linux -> Arch Server Setup`
* Follow partitioning and installation prompts

Once installation finishes, **remove the USB** and reboot.

---

### Step by Step archinstall

When you type archinstall at the ISO shell:

⸻

1. Disk Layout

This is where you define your partitions:
	- Use “Manual partitioning” if you already have Windows 11 on another disk.
	- Example layout for Arch disk:
		- EFI: 512 MB, FAT32, mount /boot
		- Root: rest of the disk (ext4 or btrfs) → /
		- Swap: optional (or use zram later instead of a swap partition).

VFIO + gaming:
	- ext4 = simplest, fastest, stable.
	- btrfs = great if you want snapshots & rollback (but a bit more tuning).

⸻

2. Bootloader
	- Choose systemd-boot.
		- Cleaner with dual boot + VFIO configs.
	
⸻

3. Kernel
	-  linux-zen (primary), add linux as fallback.

⸻

4. Networking
	-  NetworkManager 

⸻

5. Audio
	- Choose PipeWire.

⸻

6. User Account
	1. create root password
	- Create your main user .
	- Add to wheel group →  use sudo.

⸻

7. Profile
	- minimal Environment

⸻

8. Additional Packages

You can preinstall essentials by typing them in at this step:

* base-devel 
* git 
* curl 
* wget 
* nano 
* htop 
* openssh 
* pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber 

⸻

9. Optional repos
	-  enable multilib 




---
## First Boot Tasks

After reboot, 

```bash
sudo pacman -S hyprland vim kitty flatpak timesh
```


the system will likely default to using the **NVIDIA GPU** for display. If this happens and you want to force it to use the iGPU:

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
HOOKS=(modconf)
```

Then:

```bash
sudo mkinitcpio -P
sudo mkinitcpio -P linux
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
sudo pacman -Syu linux-firmware amd-ucode

```

```conf
Section "Device"
    Identifier "AMD"
    Driver "amdgpu"
    BusID "PCI:17:0:0"
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



## 💻 BONUS: Install Hyprland (ML4W Dotfiles)

```bash
##stable release
https://raw.githubusercontent.com/mylinuxforwork/dotfiles/main/hyprland-dotfiles-stable.dotinst
```


https://mylinuxforwork.github.io/dotfiles-installer/
https://mylinuxforwork.github.io/dotfiles/