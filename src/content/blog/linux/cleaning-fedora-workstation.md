+++
title= 'Cleaning Fedora Workstation '
date= '2025-05-20'
description= 'cleaning and maintaining my Fedora Workstation '
tags = ['fedora', 'linux', 'cleaning', 'maintenance', 'workstation' ]
+++

After months of daily use, testing software, and general tinkering, my Fedora Workstation setup continues to be reliable and solid.

Fedora has become my go-to distro for development, desktop productivity, and gaming. Running Hyprland (specifically ML4W Hyprland), it’s fast, modern, and refreshingly stable.
<!--more-->

---

## Stress Testing 

Here’s a list of experiments and system changes I’ve thrown at Fedora — and through it all, I never had to reinstall:

- Switched between multiple desktop environments (GNOME, KDE, Hyprland)
- Installed and removed display managers (GDM, SDDM, no DM)
- Played with GPU passthrough (VFIO) for Windows VMs on an NVIDIA RTX 4090
- Compiled and ran custom network and audio drivers
- Used it as a container host with Podman, Docker, and Flatpaks
- Ran multiple local LLMs and Ollama for AI tooling

Despite all Fedora has never failed to boot, corrupted itself, or lost data.

---

## Cleanup Routine

Here are the tools and steps I use to keep Fedora lean and fast:

### Remove Unused Flatpaks

```bash
flatpak uninstall --unused #Clears unused Flatpak runtimes and app versions.
```



### Clean DNF Cache

```bash
sudo dnf clean all #Frees up space by removing package metadata and old caches.
```



### Check Disk Usage with ncdu
A terminal-based disk usage analyzer.

```bash
sudo dnf install ncdu
sudo ncdu /
```

### Skip Temporary Mounts
Skips ephemeral or mounted volumes.
```bash
sudo ncdu / --exclude /run --exclude /mnt --exclude /media
```

### Clean Out /opt

Manually installed binaries and tools. Remove what you don’t need.

### Manage Timeshift Snapshots

Timeshift is amazing.

```bash
timeshift-launcher               # Launch the GUI
sudo timeshift --list            # List existing snapshots
sudo timeshift --delete --snapshot 'YYYY-MM-DD_HH-MM-SS'  # Delete specific snapshot
sudo timeshift --delete-all --keep 3                      # Keep only latest 3 snapshots
```


### Verify Disk Usage

```bash
df -h       # View mount point usage
lsblk       # View partition layout
```

### Remove Orphaned Packages
Finds and removes unused packages.

```bash
dnf repoquery --unsatisfied
sudo dnf autoremove
```



---

## Clean System Logs

```bash
sudo journalctl --vacuum-time=2weeks   #Frees up space used by logs older than two weeks.
```



---

After many years using different operating systems, Fedora is my favorite and most trusted workstation... clean, fast, secure, and highly customizable.

I highly recommend it. Just don’t forget to clean every now and then.

— Franco
