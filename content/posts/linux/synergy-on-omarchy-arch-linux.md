+++
title= 'Synergy 1 + Waynergy on Omarchy Arch Linux (Hyprland Wayland Setup)'
date= '2025-11-24'
description= 'How I finally got Synergy 1 working on macOS (server) and Arch Linux Hyprland (client) using Waynergy, including keyboard fix, Mac QWERTY keymap, autostart, and manual launch setup.'
tags = ['arch', 'linux', 'wayland', 'synergy', 'waynergy', 'hyprland']
+++

## Overview

After **many hours of testing**, trying:

- Synergy 3 on macOS and Linux  
- Flatpak builds  
- AUR variants  
- Deskflow and other alternatives  

I finally landed on a combo that actually works well on Wayland with Hyprland:

- **macOS (server)**: Synergy 1  
- **Arch Linux (client)**: Waynergy  
- **Desktop**: Omarchy / Hyprland  
- **Backend**: `wlr`  
- **Keyboard fix**: using Waynergy `raw-keymap` instead of xkb

Mouse was perfect from the start. The hard part was the **keyboard**, especially the letters `A`, `E`, `R` and the **Command / Option** keys from the Mac mapping correctly on the Arch client.

The final working solution uses:

- Hyprland’s own keyboard map (`wl_keyboard_map = true`)  
- Synergy key codes (`syn_raw_key_codes = true`)  
- A custom **`[raw-keymap]`** section

Huge thanks to **ghost** for this comment and mapping reference:  
<https://github.com/r-c-f/waynergy/issues/84>

---

<!--more-->

## 1. Synergy 1 on macOS (server)

Download and install Synergy 1 from the official Symless archive:

> <https://help.symless.com/hc/en-us/articles/33745162318225-Installing-Synergy-1-on-macOS>

Basic server setup:

- Set your Mac as **Server**
- Add a client with the name: `xps`
- Place `xps` at the correct position on the grid
- Use **port 24800**
- Enable SSL if you want, but remember that Waynergy handles TLS in its own way (more on that below)

---

## 2. Install Waynergy on Arch Linux (Hyprland)

```bash
yay -S waynergy
```

Useful dependencies:

```bash
sudo pacman -S wl-clipboard libxkbcommon libinput
```

Create the config directory:

```bash
mkdir -p ~/.config/waynergy
```

---

## 3. Final working `config.ini` for Mac Synergy 1 → Waynergy (Hyprland)

Path:

```
~/.config/waynergy/config.ini
```

```ini
# ---------------------------------------------------------
# Waynergy main configuration
# ---------------------------------------------------------

# Server hostname or IP (macOS running Synergy 1)
host = Mac-2.local
# host = 192.168.145.121   # Alternative: static IP

# Synergy 1 default port
port = 24800

# This must match the screen name configured on Synergy 1 (macOS)
name = xps

# Wayland backend for Hyprland (important!)
backend = wlr

# Physical screen resolution (Waynergy uses this for pointer scaling)
width = 3200
height = 1800

# Disable xkb keymaps and rely on raw key mappings instead (more reliable for macOS)
# xkb_key_offset = 7
wl_keyboard_map = true

# Enable Synergy raw keycode interpretation (needed for Macs)
syn_raw_key_codes = true

# ---------------------------------------------------------
# Screensaver / Idle Behavior
# ---------------------------------------------------------

[screensaver]
# What to run when macOS tells the client to start screensaver
start = pkill -SIGUSR1 #swayidle

# What to run when macOS exits screensaver
stop = pkill swaylock

[idle-inhibit]
# Prevent screen from sleeping by sending a dummy key event
method = key
keyname = HYPR

# ---------------------------------------------------------
# TLS Settings
# ---------------------------------------------------------

[tls]
enable = true     # Enable encryption
tofu = true       # Trust-On-First-Use (accept first certificate automatically)

# ---------------------------------------------------------
# Logging Settings
# ---------------------------------------------------------

[log]
level = 4         # More verbose logging (0 = none, 6 = very noisy)
mode = a          # Append to log file
path = /tmp/waynergy.log

# ---------------------------------------------------------
# Raw Keymap (macOS → Arch Linux)
# These remap raw keycodes received from Synergy 1
# to local Linux Wayland keycodes. This is the magic that
# fixes A, E, R, CMD, OPTION, etc.
# ---------------------------------------------------------

[raw-keymap]
54 = 9
19 = 10
20 = 11
21 = 12
22 = 13
24 = 14
23 = 15
27 = 16
29 = 17
26 = 18
30 = 19
28 = 20
25 = 21
52 = 22
49 = 23
13 = 24
14 = 25
15 = 26
16 = 27
18 = 28
17 = 29
33 = 30
35 = 31
36 = 33
31 = 35
37 = 36
60 = 37
1 = 38
2 = 39
3 = 40
4 = 41
6 = 42
5 = 43
39 = 44
41 = 45
38 = 46
42 = 47
40 = 48
51 = 49
43 = 51
7 = 52
8 = 53
9 = 54
10 = 55
12 = 56
46 = 57
47 = 58
44 = 59
48 = 60
45 = 61
57 = 62

# Function keys / arrows
68 = 63
56 = 133   # CMD key (Super)
50 = 65
58 = 66
123 = 67
121 = 68
100 = 69
119 = 70
97 = 71
98 = 72
99 = 73
101 = 74
102 = 75
110 = 76
72 = 77

# Numeric + arrow block
90 = 79
92 = 80
93 = 81
79 = 82
87 = 83
88 = 84
89 = 85
70 = 86
84 = 87
85 = 88
86 = 89
83 = 90
69 = 91

# More media/navigation keys
104 = 95
112 = 96
77 = 104
76 = 106
116 = 110
127 = 111
117 = 112
124 = 113
125 = 114
120 = 115
126 = 116
122 = 117
118 = 119

# Mac OPTION → Linux ALT
59 = 64
```

---
You can tune mappings further by using:

```bash
waynergy-mapper -r
```

This lets you press each key on the Mac and see what Synergy sends, then map it into the proper Linux keycode.

---

## 4. Manual test: run Waynergy from terminal

Once `config.ini` is in place, you can simply run:

```bash
waynergy
```

Because `host`, `port`, `name`, and `backend` are defined in the config file, `waynergy` will read them from there.

If you prefer to be explicit:

```bash
waynergy -b wlr -c Mac-2.local -p 24800 -N xps
```

If everything is correct, you should see something like:

```text
[INFO] Compositor seems to be Hyprland
[INFO] Using wlroots virtual input protocols
[INFO] Using ext-idle-notify-v1 idle inhibition protocol
[INFO] Going to connect to Mac-2.local at port 24800
[INFO] Server is Synergy 1.8
[INFO] Connected as client "xps"
```

At that point:

- Mouse moves from macOS → Arch when you cross the edge  
- Keyboard works including `A`, `E`, `R`, and modifier keys like `cmd`, `alt`, etc.

---

## 5. Run Waynergy in the background (and close the terminal)

You don’t want to keep a terminal open forever just to keep `waynergy` alive.  
Here are the best ways to run it in the background and **detach it from your terminal**.

### Option A — One-off background run with `nohup`

This is great when you just want to launch it manually and forget:

```bash
nohup waynergy &> ~/.local/share/waynergy.log &
```

- `nohup` keeps the process running even if you close the terminal.  
- `&>` redirects stdout/stderr to the log file.  
- `&` sends it to the background.

You can safely close the terminal afterwards.

To check if it is running:

```bash
pgrep -a waynergy
```

To stop it:

```bash
killall waynergy
```

---

### Option B — Systemd user service (recommended)

For a cleaner long-term setup, use a **user-level systemd service**.  
This starts Waynergy automatically at login and restarts it if it ever crashes.

Create the service file:

```bash
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/waynergy.service
```

Paste:

```ini
[Unit]
Description=Waynergy Synergy Client (Hyprland)
After=network.target

[Service]
ExecStart=/usr/bin/waynergy
Restart=always
RestartSec=2

# Optional: environment for XDG + Wayland
Environment=WAYLAND_DISPLAY=wayland-1
Environment=XDG_RUNTIME_DIR=%t

[Install]
WantedBy=default.target
```

Reload and enable:

```bash
systemctl --user daemon-reload
systemctl --user enable --now waynergy.service
```

Check logs:

```bash
journalctl --user -u waynergy.service -f
```

Stop it:

```bash
systemctl --user stop waynergy.service
```

This way:

- Waynergy runs completely in the background  
- It is started automatically on login  
- You can close all terminals and it will keep working  

---

### Option C — Hyprland `exec-once` (session-level)

You can also start Waynergy from your Hyprland config:

```bash
nano ~/.config/hypr/hyprland.conf
```

Add:

```ini
exec-once = waynergy
```

This launches it once per Hyprland session.  
You still manage it like any other process, but it starts automatically when your session starts.

---

## 6. Optional: small launcher script

If you like having a simple alias-style launcher, you can wrap the `nohup` command:

```bash
mkdir -p ~/bin
nano ~/bin/waynergy-start
```

```bash
#!/usr/bin/env bash
nohup waynergy &> ~/.local/share/waynergy.log &
```

Make it executable:

```bash
chmod +x ~/bin/waynergy-start
```

Then run:

```bash
waynergy-start
```

and close the terminal.  
This works nicely even without systemd if you prefer something simpler.

---

## Final notes

- This setup is: **Synergy 1 macOS server → Waynergy client on Arch (Hyprland)**.  
- No custom xkb keymap is required, only a raw-keymap block.  
- `cmd` and `option` are mapped to **Super** and **Alt**, so shortcuts feel natural.  
- Using a systemd user service makes it feel “native” and hands-off after the first configuration.

If future Hyprland / Wayland protocols make Synergy-style apps easier, I’ll probably revisit Synergy 3 or Deskflow.  
But for now, this combo works reliably and feels smooth enough to forget it’s even there.
