+++
title= 'Cheatsheet: Nmap Commands'
date= '2025-05-22'
description= 'Nmap scan cmd for discovery, enumeration, firewall detection, etc'
tags = ['nmap', 'networking', 'cheatsheet']
+++

A practical list of commonly used Nmap scan profiles. Use these to discover hosts, detect services, find open ports, trace routes, and identify firewall rules.

Only scan systems you own or have explicit permission to test. Authorization must cover
every system involved, including an idle-scan "zombie." Review each NSE script before use;
some scripts are intrusive or disruptive even when the scan timing is slow.
<!--more-->

---

## Host & Network Mapping

```bash
# List network interfaces on the scanning host
nmap --iflist

# Host discovery without a port scan; probes vary by network and privileges
nmap -sn 192.168.1.0/24

# Probe with TCP SYN and ACK discovery when ICMP is blocked
nmap -PS -PA 192.168.1.1

# Discover hosts with ARP (LAN only)
nmap -PR 192.168.1.0/24
```

---

## Port Scanning

```bash
# Scan for open ports (default 1000 ports)
nmap TARGET

# Fast scan of the top 100 common ports
nmap -F TARGET

# Full TCP port scan (all 65535 ports)
nmap -p- TARGET

# Full UDP port scan
nmap -sU -p- TARGET

# TCP FIN scan (behavior varies; it remains detectable)
nmap -sF TARGET

# TCP ACK scan (check for firewall presence)
nmap -sA TARGET

# Xmas scan (nonstandard flags; it remains detectable)
nmap -sX TARGET

# Null scan (no flags set)
nmap -sN TARGET

# Idle scan (requires authorization for both the zombie and target)
nmap -sI ZOMBIE_IP TARGET

# Slower timing; this does not make a scan undetectable
nmap -T1 TARGET
```

---

## Service & OS Detection

```bash
# Detect service versions on open ports
nmap -sV TARGET

# Detect OS and traceroute
nmap -O --traceroute TARGET

# Limit OS probes to web ports; this still requires authorization
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

# Run the reviewed "safe" category; inspect its current script list first
nmap --script=safe TARGET

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
nmap_slow:              slower timing, still detectable (nmap -T1)
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
nmap_web_ports_osscan:  OS detection limited to web ports (nmap -O -p 80,443)
nmap_ping_scan:         host discovery without a port scan (nmap -sn)
```

---

Remember, scans such as `-A`, `--script`, `-sU`, and `-p-` can generate heavy traffic,
trigger defenses, or disrupt fragile services. Avoid `--script=all`; choose explicit,
reviewed scripts and test them in a lab before using them on an authorized production target.


— Franco
