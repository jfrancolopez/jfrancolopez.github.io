+++
title= 'Omarchy Setup Dual boot and Auto-login (manual installation)'
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
| /dev/nvme0n1p1 | /boot | fat32  | 2GiB  | EFI, Limine & kernels |
| /dev/nvme0n1p2 | /     | btrfs | rest  | Root partition       |
compress=zstd
---

## Mounting Partitions

```bash
mount /dev/nvme0n1p2 /mnt
mkdir -p /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
```
------------------------------
|name    |  mountpoint|
|--------|------------|
|@       |  /         |
|@home   |  /home     |
|@log    |  /var/log  |
|@pkg    |  /var/cache/pacman/pkg|


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
- Bootloader: Limine
- Optional Repositories: Multilib

---

## Post-install

Install additional software:

```bash
sudo pacman -S base-devel git curl wget nano htop openssh pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber
```


### /boot/limine.conf

```bash
TIMEOUT=10
DEFAULT_ENTRY=3

/Windows 11
  protocol: efi
  path: boot):/EFI/Microsoft/Boot/bootmgfw.efi
  comment Boot into windows 11

/+Archito
  comment: Omarchy
  comment: machine-id=xxxx order priority=50
    //Linux
    comment: 6.17.3-arch2-1
    protocol: efi_chainload
    image_path: boot():/EFI/Linx/omarchy_linux.efiXXXX

    //Snapshots...




EOF
```
### useful link: https://github.com/basecamp/omarchy/discussions/1604

---

## Copy Windows Bootloader

Mount your Windows EFI partition:

```bash
##identify the right drive
lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINT,UUID,MODEL,PARTUUID
##create and mount
mkdir -p /mnt/windows_efi
sudo mount /dev/nvme2n1p1 /mnt/windows_efi
```

Copy contents:

```bash
sudo cp -r /mnt/windows_efi/EFI/Microsoft /boot/EFI/
```

---

## Enable TTY Autologin ( also available on GUI w christitus tool)

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
