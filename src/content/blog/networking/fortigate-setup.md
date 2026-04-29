+++
title= 'FortiGate - Setup and Config notes'
date= '2025-05-22'
description= 'Guid with some common configuration that i used, CLI and security best practices for fortigate firewalls'
tags = ['fortigate', 'firewall', 'networking', 'security' ]
+++
  

Over the years, I’ve worked with many FortiGate units across different sites. This are some of my notes where compiles some of the most common changes, configurations, and CLI commands that I use to standardize and secure deployments.
<!--more-->
  
---
## 🔐 Security Settings

### System → Settings → Email Service

- SMTP server: `smtp.gmail.com`
    
- Port: `465`
    
- Security mode: `smtps`
    
- Use Google app password for authentication
    

### System → Administrators

- Delete unused admin accounts
    
- Add email for alerts
    
- Enable SMS or FortiToken two-factor authentication
    

### Log & Report → Email Alert Settings

- **From**: `example.system@gmail.com`
    
- **To**: `franco.lopez@email.com`
    
- Enable alerts for:
    
    - Intrusion detected
        
    - Virus detected
        
    - Policy denied traffic
        
    - Admin login/logout
        
    - Firewall auth failure
        

---

## 🔑 FortiToken Setup

1. Navigate to **User & Device → FortiTokens**
    
2. Generate the two free tokens
    
3. Assign token to a user
    
4. Go to **System → Administrators** and activate 2FA
    

---

## 🌐 DNS Settings
activate this option to make custom dns changes
**System → Feature Visibility → Network → DNS SERVER**

---

## 🛡️ Firewall Policies

Make sure the following is enabled:  
**System → Feature Visibility → Multiple Interface Policies**

This allows creating granular firewall rules between interfaces.

---

## 🧰  CLI Commands

### General Monitoring & Debugging

```bash
# Show system status
get system status

# Show performance statistics
get system performance status

# Show CPU and memory usage
get system performance top

# Show uptime
diagnose sys uptime

# Show current sessions
diagnose sys session list

# View CPU, memory, and session counters live
diagnose sys top
```

### Interface & Routing

```bash
# Show all interfaces
get system interface

# Check interface IP and status
diagnose ip address list

# Show routing table
get router info routing-table all

# Traceroute from FortiGate
execute traceroute www.google.com
```

### Logs & Diagnostics

```bash
# Enable debug and monitor GUI actions
diag debug cli 6
diag debug enable
# Perform GUI actions
diag debug disable

# Display log output
execute log display

# Show recent events
diagnose debug enable
diagnose debug application event -1
diagnose debug disable
```

### VPN Commands

```bash
# Show IPsec tunnel status
get vpn ipsec tunnel summary

# Restart SSL VPN
diagnose vpn ssl restart

# Troubleshoot VPN
diagnose debug enable
diagnose debug application ike -1
diagnose debug console timestamp enable
```

### Backup & Restore

```bash
# Backup config to FTP
execute backup config ftp <server> <username> <password> <filename>

# Restore config from FTP
execute restore config ftp <filename> <server> <username> <password>
```

### Firmware & Updates

```bash
# Check current firmware
get system status

# Upgrade via TFTP (advanced)
execute restore image tftp <image-name> <tftp-ip>
```

### Policy & Object Management

```bash
# Show firewall policies
show firewall policy

# Show address objects
show firewall address

# Create address object (example)
config firewall address
edit Server1
set subnet 192.168.10.10 255.255.255.255
set type ipmask
next
end
```

---

## 🧱 Other Tasks You’ll Often Need

- Configure static routes for VPN and WAN failover
    
- Set up SD-WAN rules (System → Feature Visibility)
    
- Configure VLAN subinterfaces for LAN segmentation
    
- Use VDOMs to separate different tenants or business units
    
- Enable logging for all firewall rules
    
- Tune DNS filter profiles under Security Profiles
    
- Schedule automatic backups to FTP/SFTP or USB
    
- Set up FortiCloud or FortiAnalyzer logging if available
    

---

This are some of my notes based on my hands-on experience with FortiGate firewalls across different sites and business needs. hope this helps to anyone.

— Franco