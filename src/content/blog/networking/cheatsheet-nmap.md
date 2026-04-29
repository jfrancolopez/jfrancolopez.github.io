+++
title= 'Cheatsheet: Nmap Commands'
date= '2025-05-22'
description= 'Nmap scan cmd for discovery, enumeration, firewall detection, etc'
tags = ['nmap', 'networking', 'cheatsheet']
+++

A practical list of commonly used Nmap scan profiles. Use these to discover hosts, detect services, find open ports, trace routes, and identify firewall rules.
<!--more-->

---

## Host & Network Mapping

```bash
# List network interfaces on the scanning host
nmap --iflist

# Ping scan to find live hosts (ICMP only)
nmap -sn 192.168.1.0/24

# Ping through firewalls using SYN and ACK instead of ICMP
nmap -PS -PA 192.168.1.1

# Discover hosts with ARP (LAN only)
nmap -PR 192.168.1.0/24
```

---

## Port Scanning

```bash
# Scan for open ports (default 1000 ports)
nmap TARGET

# Fast scan of top 300 common ports
nmap -F TARGET

# Full TCP port scan (all 65535 ports)
nmap -p- TARGET

# Full UDP port scan
nmap -sU -p- TARGET

# TCP FIN scan (stealth, may bypass firewalls)
nmap -sF TARGET

# TCP ACK scan (check for firewall presence)
nmap -sA TARGET

# Xmas scan (another stealthy technique)
nmap -sX TARGET

# Null scan (no flags set)
nmap -sN TARGET

# Idle scan (completely stealthy)
nmap -sI ZOMBIE_IP TARGET

# Slow scan to reduce detection by intrusion systems
nmap -T1 TARGET
```

---

## Service & OS Detection

```bash
# Detect service versions on open ports
nmap -sV TARGET

# Detect OS and traceroute
nmap -O --traceroute TARGET

# Web-safe OS scan (uses HTTP/HTTPS ports only)
nmap -O -p 80,443 TARGET

# Aggressive fingerprinting
nmap -A TARGET
```

---

## Script Scans & Vulnerability Detection

```bash
# Default scripts
nmap -sC TARGET

# Run specific script
nmap --script=http-title TARGET

# Run all available scripts
nmap --script=all TARGET

# Run with vulscan
nmap -sV --script=vulscan/vulscan.nse TARGET

# Run with nmap-vulners (if installed)
nmap -sV --script vulners TARGET
```

---

## Advanced Scans

```bash
# Aggressive scan with OS/service detection, script scan, traceroute
nmap -A TARGET

# Full aggressive scan with all ports
nmap -p- -A TARGET

# Full scan + NSE scripts
nmap -p- -A -sC TARGET
```

---

## Output Options

```bash
# Save output to normal text file
nmap -oN output.txt TARGET

# Save output to XML
nmap -oX output.xml TARGET

# Save all formats at once
nmap -oA scan_result TARGET
```

---

## Named Profiles (Short Descriptions)

```bash
nmap_open_ports:        scan for open ports on target
nmap_list_interfaces:   list all interfaces (nmap --iflist)
nmap_slow:              slow scan, stealthier (nmap -T1)
nmap_fin:               TCP FIN scan (nmap -sF)
nmap_full:              full aggressive scan (nmap -p- -A)
nmap_check_for_firewall: TCP ACK scan (nmap -sA)
nmap_ping_through_firewall: host discovery using SYN/ACK probes (nmap -PS -PA)
nmap_fast:              fast scan, top ports only (nmap -F)
nmap_detect_versions:   scan all ports, detect OS/services (nmap -sV -O -p-)
nmap_check_for_vulns:   run vulscan script (nmap -sV --script=vulscan)
nmap_full_udp:          scan all ports with UDP (nmap -sU -p-)
nmap_traceroute:        enable traceroute (nmap --traceroute)
nmap_full_with_scripts: full scan with scripts (nmap -p- -A -sC)
nmap_web_safe_osscan:   OS detection using web ports (nmap -O -p 80,443)
nmap_ping_scan:         ICMP ping scan (nmap -sn)
```

---

Remember, some scans (e.g., -A, --script, -sU, -p-) are noisy and may trigger firewalls or alert systems.


— Franco