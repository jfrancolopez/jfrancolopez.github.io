+++
title= 'Cheatsheet: Cisco Networking Commands'
date= '2025-05-20'
description= 'A collection of useful Cisco IOS CLI commands for secure network administration.'
tags = ['cisco', 'networking', 'cheatsheet']
+++

These notes include Cisco IOS CLI commands I have used for managing lab and production networks. They cover secure administrative access, VLAN isolation, ACLs, NAT, and LACP configuration.

The addresses are examples and must be adapted to the local design. Keep console access or
an existing administrative session open while changing VTY ACLs so a mistake can be reversed.
<!--more-->

---

## Verify Administrative Access

Connect from an administrative workstation with SSH rather than Telnet:

```bash
ssh admin@DEVICE_IP
```

Then display the IOS version and hardware information:

```
show version
```

---

## Isolate Management Traffic (VLAN)

```
enable
configure terminal
vlan 10
 name MANAGEMENT
exit
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit
end
show vlan brief
show ip interface brief
```

---

## Enable SSH Access

Run `show running-config | section line vty` first and apply the policy to every VTY range
the device exposes. The common range below is `0 15`; adjust it for the platform.

```
enable
configure terminal
hostname SWITCH01
ip domain-name yourdomain.com
username admin privilege 15 secret YOUR_STRONG_UNIQUE_SECRET
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 15
 transport input ssh
 login local
exit
end
```

---

## Restrict Access via ACL

Add and verify the current management source before applying the ACL to VTY lines. Applying
the wrong ACL can immediately lock out remote administration.

```
enable
configure terminal
ip access-list standard 50
 permit 192.168.10.0 0.0.0.255
 deny any
exit
do show access-lists 50
line vty 0 15
 access-class 50 in
exit
end
```

---

## User Privileges

```
enable
configure terminal
username admin privilege 15 secret STRONG_PASSWORD
line vty 0 15
 login local
exit
end
```

---

## Block Unauthorized Physical Connections

```
enable
configure terminal
interface range fastEthernet 0/1-24
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation shutdown
exit
end
```

---

## Add OSPF Routes (Router)

On the main router:

```
enable
configure terminal
router ospf 3
 network 10.3.3.0 0.0.0.15 area 5
exit
end
show ip route
```

On the new router:

```
enable
configure terminal
router ospf 1
 network 10.3.3.0 0.0.0.15 area 5
 network 192.168.56.0 0.0.0.255 area 5
exit
end
show ip route
```

---

## Centralized Syslog

```
enable
configure terminal
service timestamps log datetime msec
service timestamps debug datetime msec
logging 192.168.10.50
logging trap informational
end
```

---

## Access Control Lists (ACLs)

### Standard ACL

```
enable
configure terminal
ip access-list standard 10
 deny host 192.168.2.80
 permit any
exit
end
```

### Apply to an interface

```
enable
configure terminal
interface gi1/0/2
 ip access-group 10 out
exit
end
```

### Extended ACL Example (block FTP)

```
enable
configure terminal
ip access-list extended 111
 deny tcp host 192.168.2.10 host 198.51.100.100 eq ftp
 permit ip any any
exit
interface gi1/0/2
 ip access-group 111 out
exit
end
```

---

## NAT Configuration

### Static NAT

```
enable
configure terminal
ip nat inside source static 192.168.2.34 203.0.113.34
interface gi0/0
 ip nat inside
exit
interface gi0/1
 ip nat outside
exit
end
```

### Dynamic NAT

```
enable
configure terminal
ip access-list standard 80
 permit 192.168.2.0 0.0.0.255
exit
ip nat pool POOL-NAT 203.0.113.10 203.0.113.11 netmask 255.255.255.0
ip nat inside source list 80 pool POOL-NAT
interface gi0/0
 ip nat inside
exit
interface gi0/1
 ip nat outside
exit
end
```

### Verify translations

```
show ip nat translations
show ip nat statistics
```

Generate permitted test traffic from an inside client, then repeat the router checks.

---

## LACP (Link Aggregation Control Protocol)

```
enable
configure terminal
interface range GigabitEthernet1/0/20-23
 switchport mode trunk
 switchport trunk native vlan 36
 switchport trunk allowed vlan 36,39,136
 channel-group 1 mode active
exit
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 36
 switchport trunk allowed vlan 36,39,136
exit
end
```

### Verify LACP status

```
show etherchannel summary
```

You should see ports bundled into Po1(SU) with the appropriate flags.

---

## Additional Useful Commands

```
show running-config
show startup-config
show interfaces status
show mac address-table
show ip interface brief
show vlan brief
show cdp neighbors detail
copy running-config startup-config
```

`reload` is intentionally omitted from the generic block because it interrupts service and
must be scheduled and confirmed against the device's change plan.

---

These notes are built from real-world experience managing branch networks, lab setups, and production environments. Suggestions or improvements are always welcome.

-Franco
