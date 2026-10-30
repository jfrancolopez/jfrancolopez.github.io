+++
title= 'Archived Arch and Omarchy Dual-Boot Setup Notes'
date= '2025-10-20'
description= 'Archived notes from a manual Arch Linux dual-boot setup using Limine, Omarchy, autologin, and VFIO.'
tags = ['arch', 'linux', 'limine', 'omarchy', 'vfio', 'dualboot']
+++

> **Archived setup note (October 2026):** This records a machine-specific 2025
> installation, not current installation guidance. Omarchy retired its online installer,
> and upstream bootloader tooling has changed. Check the current official documentation,
> back up your data, and review every script locally before running it.

## Overview

This historical record covers an **Arch Linux** installation with:
- Optional unencrypted root for fully unattended boot
- `limine` as the bootloader
- Larger `/boot` partition to accommodate multiple kernels
- Dual boot with Windows 11
- The former in-place Omarchy desktop setup
- VFIO passthrough using AMD iGPU + NVIDIA RTX 4090
- Snapshots via BTRFS (optional)

> TTY autologin works after an encrypted disk is unlocked; it does not require disabling
> LUKS. Disabling LUKS removes data-at-rest protection, while autologin gives anyone at the
> console immediate access to the account. Use either choice only after considering the
> machine's physical security and threat model.

---
<!--more-->
## Disk Layout (Manual Partitioning)

Use `lsblk -f` or this enhanced command for details:

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINT,UUID,MODEL,PARTUUID
sudo blkid
```

### Historical Unencrypted Layout

This table records the old machine. It is not a layout to copy onto another disk.

| Partition | Mount Point | Type  | Size  | Use                |
|-----------|-------------|-------|-------|---------------------|
| /dev/nvme0n1p1 | /boot | fat32  | 2GiB  | EFI, Limine & kernels |
| /dev/nvme0n1p2 | /     | btrfs | rest  | Root partition       |

---

## Start `archinstall`

Do not pre-mount partitions under `/mnt` before using Archinstall's guided storage flow.
Current pre-mounted configurations use `/mnt/archinstall`, and an encrypted layout requires
different mappings. Let Archinstall create and mount the selected layout, or follow the
pre-mounted configuration steps for the exact Archinstall version in use.

```bash
archinstall
```

### Important Configs:
- Filesystem: **btrfs** or **ext4**
- Bootloader: **Limine**
- Profile: **Minimal**
- Hostname, root password, main user
- Enable: NetworkManager, PipeWire
- Encryption: keep LUKS unless fully unattended boot is an explicit requirement
- Optional Repositories: Multilib

---

## Post-install

Finish Archinstall, leave the live environment, and boot the installed system. Only then
install additional software:

```bash
sudo pacman -S base-devel git curl wget nano htop openssh pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber
```


### Limine configuration

Limine entries contain machine-specific partition identifiers and kernel paths. Generate
them for the installed system and validate them against the current
[Limine documentation](https://github.com/limine-bootloader/limine) instead of copying an
example from another machine.

Related discussion: [Omarchy discussion 1604](https://github.com/omacom/omarchy/discussions/1604)

---

## Configure the Windows Boot Entry

Copying the Windows EFI files does not create a Limine menu entry, and Limine does not
auto-discover Windows. Identify the existing Windows ESP without modifying it:

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINT,UUID,MODEL,PARTUUID
sudo mkdir -p /mnt/windows_efi
sudo mount --options ro /dev/disk/by-uuid/WINDOWS_ESP_UUID /mnt/windows_efi
```

Add an explicit EFI chainload entry using the syntax for the installed Limine version and
the actual ESP path. Validate that entry against the current Limine documentation. Do not
copy or overwrite EFI files unless the boot design requires it and a verified backup exists.

---

## Enable TTY Autologin ( also available on GUI w christitus tool)

This bypasses the login prompt on the physical console. Do not enable it on an unattended
or physically accessible machine.

```bash
sudo mkdir -p /etc/systemd/system/getty@tty1.service.d/
cat <<'EOF' | sudo tee /etc/systemd/system/getty@tty1.service.d/override.conf
[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin yourusername --noclear %I $TERM
EOF
```

---
## Optional: Chris Titus Linux Utility

Do not pipe a remote installer directly into a shell. If you use the
[Chris Titus Tech utility](https://github.com/ChrisTitusTech/linutil), download a pinned
release or clone the repository, inspect the code locally, and follow its current
installation instructions.


## Install Omarchy

The historical in-place installer was removed in June 2026. The current download at
[omarchy.org](https://omarchy.org/#install) is a bootable OS installer, not a command to run
on top of this manual Arch installation. Use it only for a separate, backed-up installation
target or a VM; this archived article does not provide a supported current migration path.

---

## Final Checks

Reboot:

```bash
reboot
```

Limine shows only entries that were explicitly configured. Confirm both the Arch entry and
the Windows EFI chainload entry before relying on the system to dual boot.

---

## Notes

- If you use btrfs, consider setting up Snapper or Timeshift
- `limine` doesn't need ESP mounted at `/boot/efi`, it uses `/boot`
- This setup is ideal for VFIO: host uses AMD iGPU, guest uses NVIDIA passthrough
