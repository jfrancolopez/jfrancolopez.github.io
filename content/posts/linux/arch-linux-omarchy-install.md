+++
title= 'Omarchy Setup and Auto-login (manual installation)'
date= '2025-10-20'
description= 'Installing Arch Linux without LUKS for autologin, using Limine bootloader, Omarchy desktop, and preparing for VFIO passthrough and dual boot.'
tags = ['arch', 'linux', 'limine', 'omarchy', 'vfio', 'dualboot']
+++

## Overview

This guide walks through setting up **Arch Linux** manually with:
- No LUKS (to enable autologin)
- `limine` as the bootloader
- Larger `/boot` partition to accommodate multiple kernels
- Dual boot with Windows 11
- Omarchy desktop environment (`curl -fsSL https://omarchy.org/install | bash`)
- VFIO passthrough using AMD iGPU + NVIDIA RTX 4090
- Snapshots via BTRFS (optional)

---
<!--more-->
## Disk Layout (Manual Partitioning)

Use `lsblk -f` or this enhanced command for details:

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINT,UUID,MODEL,PARTUUID
sudo blkid
```

### Example Layout

| Partition | Mount Point | Type  | Size  | Use                |
|-----------|-------------|-------|-------|---------------------|
| /dev/nvme0n1p1 | /boot | vfat  | 512M  | EFI, Limine & kernels |
| /dev/nvme0n1p2 | /     | ext4/btrfs | rest  | Root partition       |

---

## Mounting Partitions

```bash
mount /dev/nvme0n1p2 /mnt
mkdir -p /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
```

---

## Start `archinstall`

```bash
archinstall
```

### Important Configs:
- Filesystem: **btrfs** or **ext4**
- Bootloader: **None** (we will use Limine)
- Profile: **Minimal**
- Hostname, root password, main user
- Enable: NetworkManager, PipeWire
- Disable: LUKS encryption

---

## Post-install: Limine Bootloader

Install Limine:

```bash
sudo pacman -S limine
```

Format EFI partition as FAT32 if not already:

```bash
mkfs.fat -F32 /dev/nvme0n1p1
```

### Generate Limine bootloader files:

```bash
sudo limine-install /dev/nvme0n1
```

### Create `limine.cfg`

```bash
cat <<EOF | sudo tee /boot/limine.cfg
TIMEOUT=5
DEFAULT_ENTRY=ArchLinux

:ArchLinux
PROTOCOL=linux
KERNEL_PATH=boot://vmlinuz-linux
INITRD_PATH=boot://initramfs-linux.img
CMDLINE=root=/dev/nvme0n1p2 rw quiet splash loglevel=3

:Windows
PROTOCOL=chainload
CHAINLOAD_PATH=boot://EFI/Microsoft/Boot/bootmgfw.efi
EOF
```

---

## Copy Windows Bootloader

Mount your Windows EFI partition:

```bash
mkdir -p /mnt/windows_efi
mount /dev/nvme1n1p1 /mnt/windows_efi
```

Copy contents:

```bash
sudo cp -r /mnt/windows_efi/EFI/Microsoft /boot/EFI/
```

---

## Enable TTY Autologin

```bash
mkdir -p /etc/systemd/system/getty@tty1.service.d/
cat <<EOF | sudo tee /etc/systemd/system/getty@tty1.service.d/override.conf
[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin yourusername --noclear %I $TERM
EOF
```

---
## Optional: Chris Titus Arch Install Script

Chris Titus Tech provides a powerful CLI tool to speed up system setup:
```bash
sudo curl -fssl christitus.com/linux | sh
```


## Install Omarchy

```bash
curl -fsSL https://omarchy.org/install | bash
```

> ⚠️ Requires: `flatpak`, `git`, `wget`, `curl`, `base-devel`, `sudo`, `zsh`, `starship`, `xdg-user-dirs`, `hyprland`, etc.

---

## Final Checks

Reboot:

```bash
reboot
```

Limine will now show dual boot options for Arch and Windows.

---

## Notes

- If you use btrfs, consider setting up Snapper or Timeshift
- `limine` doesn't need ESP mounted at `/boot/efi`, it uses `/boot`
- This setup is ideal for VFIO: host uses AMD iGPU, guest uses NVIDIA passthrough
