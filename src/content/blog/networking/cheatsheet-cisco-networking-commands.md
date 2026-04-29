+++
title= 'Cheatsheet: Cisco Networking Commands '
date= '2025-05-20'
description= 'collection of useful Cisco CLI commands for secure network administration'
tags = ['cisco', 'networking', 'cheatsheet']
+++

This notes includes some of my most useful Cisco IOS CLI commands I’ve used for managing networks in both lab and production environments. It covers basic access protection and VLAN isolation to advanced ACLs, NAT, and LACP configuration.
<!--more-->

---

## Console Access Protection

```
# Connect to the device via Telnet
 telnet 192.x.x.x.x

# Display IOS version and hardware info
 show version

# Set a password for remote (VTY) access
 enable
 configure terminal
 line vty 0 4
 password YOUR_PASSWORD  # Set your desired password
 login                    # Require password authentication
```

---

## Isolate Management Traffic (VLAN)

```
 enable
 configure terminal
 vlan 10                            # Create VLAN 10
 name MANAGEMENT                    # Name the VLAN for clarity
 end
 show vlan                          # Confirm VLAN creation

 interface vlan 10                  # Enter VLAN interface config
 ip address 192.168.10.1 255.255.255.0  # Assign IP for management
 no shutdown                        # Enable the interface
 end
```

---

## Enable SSH Access

```
 enable
 configure terminal
 hostname SWITCH01                    # Set device hostname
 ip domain-name yourdomain.com        # Define domain name
 crypto key generate rsa              # Generate RSA keys (choose 2048 bits)
 ip ssh version 2                     # Use SSH v2 for better security
 line vty 0 4
 transport input ssh                 # Allow SSH access only
 login local                         # Use local usernames for login
```

---

## Restrict Access via ACL

```
 enable
 configure terminal
 ip access-list standard 50                 # Create standard ACL 50
 permit 192.168.10.0 0.0.0.255              # Allow internal subnet
 deny any                                   # Deny everything else

 line vty 0 4
 access-class 50 in                        # Apply ACL to VTY lines
```

---

## User Privileges

```
 enable
 configure terminal
 username admin privilege 15 secret STRONG_PASSWORD  # Create privileged user
 line vty 0 4
 login local                                           # Use local accounts for VTY login
```

---

## Block Unauthorized Physical Connections

```
 enable
 configure terminal
 interface range fastEthernet 0/1-24            # Select range of access ports
 switchport mode access                         # Set ports to access mode
 switchport port-security                       # Enable port security
 switchport port-security maximum 2             # Allow max 2 MAC addresses
 switchport port-security violation shutdown    # Shutdown port on violation
```

---

## Add OSPF Routes (Router)

```
# On the main router
 enable
 configure terminal
 router ospf 3
 network 3.3.3.0 0.0.0.15 area 5               # Define network and area

# On the new router
 router ospf 1
 network 3.3.3.0 0.0.0.15 area 5
 network 192.168.56.0 0.0.0.255 area 5         # Add second interface

 show ip route                                 # View OSPF learned routes
```

---

## Centralized Syslog

```
 enable
 configure terminal
 service timestamps log datetime msec          # Add time to logs
 service timestamps debug datetime msec
 logging 192.x.x.x                             # Set syslog server IP
 logging trap debugging                        # Log debug-level messages
 end
```

---

## Access Control Lists (ACLs)

### Standard ACL

```
 enable
 configure terminal
 ip access-list standard 10
 deny host 192.168.2.80              # Block specific IP
 permit any                          # Allow all others
 end
```

### Apply to an interface

```
 interface gi1/0/x
 ip access-group 10 out              # Apply ACL to outgoing traffic
```

### Extended ACL Example (block FTP)

```
 ip access-list extended 111
 deny tcp host 192.0.2.10 host 192.0.3.100 eq ftp  # Block FTP to specific host
 permit ip any any                                # Allow everything else

 interface gi1/0/2
 ip access-group 111 out                          # Apply extended ACL
```

---

## NAT Configuration

### Static NAT

```
 enable
 configure terminal
 ip nat inside source static 192.168.2.34 8.8.8.34  # Map private IP to public IP
 interface gi0/0
 ip nat inside
 interface gi0/1
 ip nat outside
```

### Dynamic NAT

```
 ip access-list standard 80
 permit 192.0.2.0 0.0.0.255                       # Define internal subnet

 ip nat pool POOL-NAT 8.8.8.10 8.8.8.11 netmask 255.255.255.0
 ip nat inside source list 80 pool POOL-NAT       # Use pool for NAT

 interface gi0/0
 ip nat inside
 interface gi0/1
 ip nat outside
```

# Verify translations

netstat # On PC  
show ip nat translations # On router

---

## LACP (Link Aggregation Control Protocol)

```
 configure terminal
 interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 36
 switchport trunk allowed vlan 36,39,136

# Add member interfaces
 interface range gi1/0/20 - 23
 switchport mode trunk
 switchport trunk native vlan 36
 switchport trunk allowed vlan 36,39,136
 channel-group 1 mode active                # Enable LACP active mode
```

### Verify LACP status

```
 show etherchannel summary  # Check LACP bundling status
```

You should see ports bundled into Po1(SU) with the appropriate flags.

---

## Additional Useful Commands

```
show running-config        # View active config in RAM
show startup-config        # View config stored in NVRAM
show interfaces status     # Show link status and VLAN assignments
show mac address-table     # Display MAC-to-port mapping
show ip interface brief    # Summarized interface status
show vlan brief            # Quick VLAN overview
show cdp neighbors detail  # View connected Cisco devices
copy running-config startup-config  # Save current config
reload                     # Reboot the device (confirm required)
```

---

These notes are built from real-world experience managing branch networks, lab setups, and production environments. Suggestions or improvements are always welcome.

-Franco

