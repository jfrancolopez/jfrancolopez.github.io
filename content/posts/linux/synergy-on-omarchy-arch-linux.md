+++
title= 'Synergy 1 + Waynergy on Omarchy Arch Linux (Hyprland Wayland Setup)'
date= '2025-11-24'
description= 'How I finally got Synergy 1 working on macOS (server) and Arch Linux Hyprland (client) using Waynergy, including keyboard fix, Mac QWERTY keymap, autostart, and manual launch setup.'
tags = ['arch', 'linux', 'wayland', 'synergy', 'waynergy', 'hyprland']
+++

## Overview

After **many hours of testing**, trying **Synergy 3**, its **flatpak**, **AUR versions**, **Deskflow**, and lots of broken attempts, I finally found a stable combination:

- **macOS → Synergy 1 Pro** (server)  
- **Arch Linux (Hyprland Wayland) → Waynergy** (client)  
- **Connection over port 24800**  
- **Mac QWERTY keymap fix included**  

This setup works **perfectly for mouse**, and after configuration, **keyboard mapping is now correct**.

---
<!--more-->

## Why Synergy 1 instead of Synergy 3?

`synergy3-bin` and the flatpak version on Linux failed because:

- Wayland input APIs do **not support remote-desktop control**
- Synergy 3 requires **xdg-desktop-portal RemoteDesktop**, which Hyprland does NOT implement
- Errors like:

```
GDBus.Error:org.freedesktop.DBus.Error.InvalidArgs:
No such interface “org.freedesktop.portal.RemoteDesktop”
```

So the solution is:

> **Use Synergy 1 as server + Waynergy as the Wayland-compatible client.**

---

## Installation Steps

### 1. Install Synergy 1 on macOS (server)

Download from Symless archive:

 https://help.symless.com/hc/en-us/articles/33745162318225-Installing-Synergy-1-on-macOS

Install and configure:

- Set your Mac as **Server**
- Name your Linux client e.g. `xps`
- Place `xps` on the grid
- Disable TLS (Waynergy does not support Synergy 1 TLS)
- Use **port 24800**

---

## 2. Install Waynergy on Arch Linux (Hyprland)

```bash
yay -S waynergy
```

Confirm dependencies:

```bash
sudo pacman -S wl-clipboard libxkbcommon libinput libuinput
```

---

## 3. Create config directory

```bash
mkdir -p ~/.config/waynergy
```

---

## 4. Create `config.ini` (important for correct keyboard)

Save this at:

```
~/.config/waynergy/config.ini
```

### **Mac QWERTY → Wayland fix**

```ini
[syn]
raw_key_codes = false

[raw-keymap]
# Correct mapping for macOS server → Arch client
# Generated with waynergy-mapper (edited)
30 = 20
31 = 26
32 = 8
33 = 21
34 = 23
35 = 28
36 = 24
37 = 12
38 = 18
39 = 19
45 = 25
46 = 29
```

This fixes issues like:

| Key pressed | Wrong output | Fixed |
|------------|--------------|--------|
| `q`        | `4`          | ✔ correct |
| `w`        | `4`/`5`/`6`  | ✔ correct |
| `u`        | `p`          | ✔ correct |
| Backspace  | `z`          | ✔ correct |

---

## 5. Start Waynergy manually (recommended for first test)

```bash
waynergy -b wlr -c 192.168.145.121 -p 24800 -N xps
```

Breakdown:

| Argument | Meaning |
|---------|---------|
| `-b wlr` | Hyprland backend |
| `-c IP` | Server (Mac) IP |
| `-p 24800` | Synergy 1 default port |
| `-N xps` | Client name (must match server config) |

Expected output:

```
Connected to synergy server
Mouse + Keyboard active
```

---

## 6. Verify Waynergy is loading your config

Run:

```bash
WAYNERGY_LOG=debug waynergy -b wlr -c 192.168.145.121 -p 24800 -N xps
```

You should see:

```
Loading config from ~/.config/waynergy/config.ini
```

If not, force it:

```bash
waynergy -C ~/.config/waynergy/config.ini -b wlr -c 192.168.145.121 -p 24800 -N xps
```

---

# Autostart on Arch (Hyprland)

## Option A — Hyprland Autostart

Edit:

```
~/.config/hypr/hyprland.conf
```

Add:

```bash
exec-once = waynergy -b wlr -c 192.168.145.121 -p 24800 -N xps
```

## Option B — systemd user service

### 1. Create service file

```
mkdir -p ~/.config/systemd/user
```

```
nano ~/.config/systemd/user/waynergy.service
```

Paste:

```ini
[Unit]
Description=Waynergy Client Service
After=network.target

[Service]
ExecStart=/usr/bin/waynergy -b wlr -c 192.168.145.121 -p 24800 -N xps
Restart=always

[Install]
WantedBy=default.target
```

### 2. Enable service

```bash
systemctl --user enable --now waynergy.service
```

---

# Manual Start Script (optional)

Create:

```
~/bin/waynergy-start
```

```bash
#!/usr/bin/env bash
waynergy -b wlr -c 192.168.145.121 -p 24800 -N xps
```

Make executable:

```bash
chmod +x ~/bin/waynergy-start
```

Run anytime:

```bash
waynergy-start
```

---

# Troubleshooting

### **Keyboard still incorrect?**

Regenerate mapping:

```bash
waynergy-mapper -r
```

Press each key once → it outputs raw codes → Waynergy generates a new mapping block.

Copy the block to:

```
~/.config/waynergy/config.ini
```

---

### **Clipboard not working**

Install:

```bash
sudo pacman -S wl-clipboard
```

---

### **Connection refused**

Check if Synergy 1 is listening:

```bash
lsof -nP -iTCP -sTCP:LISTEN | grep synergy
```

You should see:

```
*:24800 (LISTEN)
```

---

## Final Result

✔ **Mouse works perfectly**  
✔ **Keyboard fully fixed with custom keymap**  
✔ **Stable connection**  
✔ **Auto-start enabled**  
✔ **Synergy 1 + Waynergy = flawless cross-device workflow**

---

