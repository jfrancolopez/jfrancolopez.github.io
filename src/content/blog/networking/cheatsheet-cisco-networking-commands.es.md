+++
title= 'Cheatsheet: Comandos de Red Cisco'
date= '2025-05-20'
description= 'Una colección de comandos útiles de Cisco IOS para la administración segura de redes.'
tags = ['cisco', 'networking', 'cheatsheet']
+++

Esta guía incluye algunos de los comandos más útiles del CLI de Cisco IOS que he utilizado para administrar redes tanto en laboratorios como en entornos de producción. Cubre desde protección básica de acceso e aislamiento de VLAN hasta configuración avanzada de ACLs, NAT y LACP.

Las direcciones son ejemplos y deben adaptarse al diseño local. Mantén acceso por consola o
una sesión administrativa abierta mientras cambias ACLs de VTY para poder revertir errores.
<!--more-->

---

## Verificar el Acceso Administrativo

Después de la configuración inicial por consola, conéctate desde una estación administrativa usando SSH:

```bash
ssh admin@IP_DEL_DISPOSITIVO
```

Después muestra la versión de IOS y la información de hardware:

```
show version
```

---

## Aislar Tráfico de Gestión (VLAN)

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

## Habilitar Acceso SSH

Ejecuta primero `show running-config | section line vty` y aplica la política a todos los
rangos VTY del equipo. El rango común es `0 15`; ajústalo según la plataforma.

```
enable
configure terminal
hostname SWITCH01
ip domain-name tudominio.com
username admin privilege 15 secret TU_SECRETO_UNICO_Y_SEGURO
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 15
 transport input ssh
 login local
exit
end
```

---

## Restringir Acceso mediante ACL

Agrega y verifica primero el origen de administración actual. Aplicar una ACL incorrecta a
las líneas VTY puede bloquear inmediatamente el acceso remoto.

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

## Privilegios de Usuario

```
enable
configure terminal
username admin privilege 15 secret CONTRASEÑA_SEGURA
line vty 0 15
 login local
exit
end
```

---

## Bloquear Conexiones Físicas No Autorizadas

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

## Añadir Rutas OSPF (Router)

En el router principal:

```
enable
configure terminal
router ospf 3
 network 10.3.3.0 0.0.0.15 area 5
exit
end
show ip route
```

En el router nuevo:

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

## Syslog Centralizado

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

## Listas de Control de Acceso (ACLs)

### ACL Estándar

```
enable
configure terminal
ip access-list standard 10
 deny host 192.168.2.80
 permit any
exit
end
```

### Aplicar a una interfaz

```
enable
configure terminal
interface gi1/0/2
 ip access-group 10 out
exit
end
```

### Ejemplo de ACL Extendida (bloquear FTP)

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

## Configuración NAT

### NAT Estático

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

### NAT Dinámico

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

### Verificar traducciones

```
show ip nat translations
show ip nat statistics
```

Genera tráfico de prueba autorizado desde un cliente interno y repite las verificaciones.

---

## LACP (Protocolo de Agregación de Enlaces)

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

### Verificar estado de LACP

```
show etherchannel summary
```

Deberías ver los puertos agrupados en Po1(SU) con los indicadores correspondientes.

---

## Comandos Adicionales Útiles

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

`reload` se omite intencionalmente porque interrumpe el servicio y debe programarse y
confirmarse según el plan de cambios del equipo.

---

Estas notas están basadas en experiencia real gestionando redes en sucursales, entornos de laboratorio y producción. Siempre son bienvenidas sugerencias o mejoras.

-Franco
