+++
title= 'Cheatsheet: Cisco Networking Commands '
date= '2025-05-20'
description= 'collection of useful Cisco CLI commands for secure network administration'
tags = ['cisco', 'networking', 'cheatsheet']
+++

Esta guía incluye algunos de los comandos más útiles del CLI de Cisco IOS que he utilizado para administrar redes tanto en laboratorios como en entornos de producción. Cubre desde protección básica de acceso e aislamiento de VLAN hasta configuración avanzada de ACLs, NAT y LACP.
<!--more-->

---

## Protección de Acceso por Consola

```
# Conectarse al dispositivo por Telnet
telnet 192.x.x.x.x

# Mostrar versión de IOS e información de hardware
show version

# Establecer contraseña para acceso remoto (VTY)
enable
configure terminal
line vty 0 4
password TU_CONTRASEÑA  # Define tu contraseña deseada
login                   # Requiere autenticación por contraseña
```

---

## Aislar Tráfico de Gestión (VLAN)

```
enable
configure terminal
vlan 10                                # Crear VLAN 10
name MANAGEMENT                        # Nombrar la VLAN
end
show vlan                              # Confirmar creación de VLAN

interface vlan 10                      # Configurar interfaz de VLAN
ip address 192.168.10.1 255.255.255.0  # Asignar IP de gestión
no shutdown                            # Activar la interfaz
end
```

---

## Habilitar Acceso SSH

```
enable
configure terminal
hostname SWITCH01                          # Asignar nombre al dispositivo
ip domain-name tudominio.com               # Definir nombre de dominio
crypto key generate rsa                    # Generar llaves RSA (elige 2048 bits)
ip ssh version 2                           # Usar SSH v2
line vty 0 4
transport input ssh                        # Permitir solo acceso SSH
login local                                # Usar usuarios locales para autenticación
```

---

## Restringir Acceso mediante ACL

```
enable
configure terminal
ip access-list standard 50                 # Crear ACL estándar 50
permit 192.168.10.0 0.0.0.255              # Permitir red interna
deny any                                   # Denegar todo lo demás

line vty 0 4
access-class 50 in                         # Aplicar ACL a las líneas VTY
```

---

## Privilegios de Usuario

```
enable
configure terminal
username admin privilege 15 secret CONTRASEÑA_SEGURA  # Crear usuario con privilegio máximo
line vty 0 4
login local                                           # Usar cuentas locales para acceso
```

---

## Bloquear Conexiones Físicas No Autorizadas

```
enable
configure terminal
interface range fastEthernet 0/1-24              # Seleccionar rango de puertos
switchport mode access                           # Establecer modo de acceso
switchport port-security                         # Habilitar seguridad de puertos
switchport port-security maximum 2               # Permitir máx. 2 direcciones MAC
switchport port-security violation shutdown      # Apagar puerto en caso de violación
```

---

## Añadir Rutas OSPF (Router)

```
# En el router principal
enable
configure terminal
router ospf 3
network 3.3.3.0 0.0.0.15 area 5                   # Definir red y área

# En el nuevo router
router ospf 1
network 3.3.3.0 0.0.0.15 area 5
network 192.168.56.0 0.0.0.255 area 5             # Agregar otra interfaz

show ip route                                     # Ver rutas aprendidas por OSPF
```

---

## Syslog Centralizado

```
enable
configure terminal
service timestamps log datetime msec              # Añadir fecha/hora a logs
service timestamps debug datetime msec
logging 192.x.x.x                                 # Definir IP del servidor Syslog
logging trap debugging                            # Nivel de logeo
end
```

---

## Listas de Control de Acceso (ACLs)

### ACL Estándar

```
enable
configure terminal
ip access-list standard 10
deny host 192.168.2.80              # Bloquear IP específica
permit any                          # Permitir el resto
end
```

### Aplicar a una interfaz

```
interface gi1/0/x
ip access-group 10 out              # Aplicar ACL al tráfico saliente
```

### Ejemplo de ACL Extendida (bloquear FTP)

```
ip access-list extended 111
deny tcp host 192.0.2.10 host 192.0.3.100 eq ftp  # Bloquear FTP a host específico
permit ip any any                                # Permitir todo lo demás

interface gi1/0/2
ip access-group 111 out                          # Aplicar ACL extendida
```

---

## Configuración NAT

### NAT Estático

```
enable
configure terminal
ip nat inside source static 192.168.2.34 8.8.8.34  # Asignar IP pública fija
interface gi0/0
ip nat inside
interface gi0/1
ip nat outside
```

### NAT Dinámico

```
ip access-list standard 80
permit 192.0.2.0 0.0.0.255                         # Definir red interna

ip nat pool POOL-NAT 8.8.8.10 8.8.8.11 netmask 255.255.255.0
ip nat inside source list 80 pool POOL-NAT         # Usar pool para NAT

interface gi0/0
ip nat inside
interface gi0/1
ip nat outside
```

# Verificar traducciones

netstat # En la PC  
show ip nat translations # En el router

---

## LACP (Protocolo de Agregación de Enlaces)

```
configure terminal
interface port-channel 1
switchport mode trunk
switchport trunk native vlan 36
switchport trunk allowed vlan 36,39,136

# Agregar interfaces miembro
interface range gi1/0/20 - 23
switchport mode trunk
switchport trunk native vlan 36
switchport trunk allowed vlan 36,39,136
channel-group 1 mode active                # Activar modo LACP
```

### Verificar estado de LACP

```
show etherchannel summary  # Verificar estado de agregación
```

Deberías ver los puertos agrupados en Po1(SU) con los indicadores correspondientes.

---

## Comandos Adicionales Útiles

```
show running-config        # Ver configuración activa en RAM
show startup-config        # Ver configuración almacenada en NVRAM
show interfaces status     # Ver estado de los puertos
show mac address-table     # Ver tabla de direcciones MAC
show ip interface brief    # Vista resumida del estado de interfaces
show vlan brief            # Vista rápida de VLANs
show cdp neighbors detail  # Ver dispositivos Cisco conectados
copy running-config startup-config  # Guardar configuración actual
reload                     # Reiniciar el dispositivo (requiere confirmación)
```

---

Estas notas están basadas en experiencia real gestionando redes en sucursales, entornos de laboratorio y producción. Siempre son bienvenidas sugerencias o mejoras.

-Franco
