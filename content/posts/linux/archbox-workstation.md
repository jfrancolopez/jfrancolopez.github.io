+++
title= 'Arch Linux Setup with VFIO GPU Passthrough'
date= '2025-06-22'
description= 'Using AMD iGPU for Host + NVIDIA RTX 4090 for VM (VFIO)'
tags = ['linux', 'arch', 'vfio', 'hyprland']
+++

My notes and reference for using **AMD iGPU for Host** + **NVIDIA RTX 4090 for VM (VFIO)** on Arch Linux.

---

## System Specs

- **Motherboard**: Gigabyte B650 GAMING X AX (rev. 1.3)
- **CPU**: AMD Ryzen 9 7950X3D (32 Threads)
- **GPU 1 (Host)**: AMD iGPU (Raphael, RDNA2)
- **GPU 2 (Passthrough/Optional Host)**: NVIDIA GeForce RTX 4090
- **Memory**: Corsair Vengeance DDR5 64GB (2×32GB) 5600 MHz CL40 (XMP, CMK64GX5M2B5600C40)
- **OS**: Arch Linux (Hyprland) + Windows 11 Pro (separate disk)

---

## BIOS Configuration

Before installing Arch, reboot into BIOS and configure:

- Enable: `IOMMU` (sometimes called SVM or AMD-Vi)  
- Enable: `ErP` (to reduce power when off)  
- Disable: `Secure Boot`  
- Disable: `XMP` (if facing instability)  
- Set **iGPU** as primary display output  

---

## Prepare Arch Installation

### Boot from Arch ISO

Check your disks:

```bash
lsblk
ls -l /dev/disk/by-id/
```

### Optional: Chris Titus Arch Install

```bash
curl -fssl christitus.com/linux | sh
```

Choose:  
- `System Setup -> Arch Linux -> Arch Server Setup`  
- Follow partitioning and installation prompts  

---

## Step by Step with `archinstall`

### 1. Disk Layout
- Manual partitioning if Windows 11 is already installed.
- Example Arch disk:
  - EFI: 512 MB, FAT32 → `/boot`
  - Root: rest (ext4 for stability or btrfs for snapshots)
  - Swap: optional (or use zram).

### 2. Bootloader
- Choose **systemd-boot**.

### 3. Kernel
- Install **linux-zen** (main) + **linux** as fallback.

### 4. Networking
- Select **NetworkManager**.

### 5. Audio
- Use **PipeWire**.

### 6. User Accounts
- Set root password.
- Create your main user and add to `wheel`.

### 7. Profile
- Choose **Minimal Environment**.

### 8. Additional Packages
```bash
base-devel git curl wget nano htop openssh pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber
```

### 9. Optional Repositories
- Enable **multilib**.

---

## First Boot Tasks

Example setup with Hyprland + ML4W dotfiles:

```bash
sudo pacman -S hyprland vim nvim kitty flatpak timeshift firefox
```

---

## Managing systemd-boot

List all boot entries:

```bash
bootctl list
```

Create a Windows entry:

```ini
# /boot/loader/entries/windows.conf
title Windows 11
efi /EFI/Microsoft/Boot/bootmgfw.efi
```

Increase boot menu timeout (default is often too fast):

```ini
# /boot/loader/loader.conf
default arch-zen.conf
timeout 10
```

Remove an old/duplicate entry:

```bash
sudo bootctl remove <entry-id>
```
---
## Installing ML4W Dotfiles with Flatpak

As part of my Hyprland setup, I used the **ML4W Dotfiles Installer** to quickly bring in a pre-configured environment.  
Below are the commands and the steps I followed.

```bash
flatpak install com.ml4w.dotfilesinstaller
```

---

### Installation Steps

1. Open **Firefox** and visit:  
   [https://mylinuxforwork.github.io/dotfiles](https://mylinuxforwork.github.io/dotfiles)

2. Run the Flatpak installer:
   ```bash
   flatpak run com.ml4w.dotfilesinstaller
   ```

3. From the website, copy the script for either the **Stable** or **Rolling** release.

4. Paste the script into a terminal and execute it.

5. Once the script finishes, return to the installer and click **Next**.

6. Adjust your display resolution.  
   > In my case, I use **2K QHD (2560×1440)**.

7. Complete the process by selecting **Install and Activate**.

8. Close the installer and reboot your system.

---

## Remove NVIDIA Host Drivers

Check installed NVIDIA packages:

```bash
pacman -Q | grep -i nvidia
```

Remove them if present (adjust to your system):

```bash
sudo pacman -Rns nvidia-utils nvidia-lts linux-firmware-nvidia
```

---

## VFIO Setup

### Identify GPU IDs
```bash
lspci -nnk | grep -A3 NVIDIA
```

### Blacklist NVIDIA
```conf
# /etc/modprobe.d/blacklist-nvidia.conf
blacklist nouveau
blacklist nvidia
blacklist nvidia_drm
blacklist nvidia_modeset
```

### Bind to VFIO
```conf
# /etc/modprobe.d/vfio.conf
options vfio-pci ids=10de:2684,10de:22ba
```

Update initramfs and bootloader:
```bash
sudo mkinitcpio -P
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

---

## Debugging Commands

```bash
lsmod | grep amdgpu
ls -l /dev/dri/
lspci -nnk | grep -A3 NVIDIA
```

---

## Desktop Setup

Install Hyprland (JaKooLit fork):

```bash
sh <(curl -L https://raw.githubusercontent.com/JaKooLit/Arch-Hyprland/main/auto-install.sh)
```

Or ML4W dotfiles:

```bash
curl -fsSL https://raw.githubusercontent.com/mylinuxforwork/dotfiles/main/hyprland-dotfiles-stable.dotinst | sh
```

---

## Conclusion

With this setup:
- **Host** uses the AMD iGPU (stable, efficient).  
- **NVIDIA RTX 4090** is isolated for passthrough into a VM.  
- Dual boot with Windows is cleanly integrated via systemd-boot.  
