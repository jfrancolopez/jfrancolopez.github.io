+++
title= 'Cheatsheet: Nmap Commands'
date= '2025-05-22'
description= 'Comandos de escaneo para la herramienta Nmap, para descubrimiento, enumeracion, etc'
tags = ['nmap', 'networking', 'cheatsheet']
+++


Aqui dejo una lista de perfiles de escaneo Nmap que he utilizado. Me ha ayudado para descubrir hosts, detectar servicios, encontrar puertos abiertos, trazar rutas y detectar firewalls.

Escanea únicamente sistemas propios o aquellos para los que tengas autorización explícita.
La autorización debe cubrir todos los equipos involucrados, incluido el "zombie" de un
idle scan. Revisa cada script NSE antes de usarlo; algunos son intrusivos o disruptivos
aunque el escaneo sea lento.
<!--more-->

---

## Mapeo de Red y Descubrimiento de Hosts

```bash
# Listar interfaces de red en el host que escanea
nmap --iflist

# Descubrimiento sin escanear puertos; las pruebas varían según red y privilegios
nmap -sn 192.168.1.0/24

# Probar descubrimiento TCP SYN y ACK cuando ICMP está bloqueado
nmap -PS -PA 192.168.1.1

# Descubrir hosts con ARP (solo en red LAN)
nmap -PR 192.168.1.0/24
```

---

## Escaneo de Puertos

```bash
# Escaneo básico de los primeros 1000 puertos
nmap TARGET

# Escaneo rápido de los 100 puertos más comunes
nmap -F TARGET

# Escaneo completo de todos los puertos TCP
nmap -p- TARGET

# Escaneo completo UDP
nmap -sU -p- TARGET

# Escaneo FIN TCP (sigue siendo detectable)
nmap -sF TARGET

# Escaneo ACK TCP (verifica si hay firewall)
nmap -sA TARGET

# Escaneo Xmas
nmap -sX TARGET

# Escaneo Null (sin banderas TCP)
nmap -sN TARGET

# Escaneo Idle (requiere autorización para el zombie y el objetivo)
nmap -sI ZOMBIE_IP TARGET

# Temporización lenta; no vuelve invisible el escaneo
nmap -T1 TARGET
```

---

## Detección de Servicios y Sistemas Operativos

```bash
# Detectar versiones de servicios
nmap -sV TARGET

# Detección de sistema operativo + traceroute
nmap -O --traceroute TARGET

# Limitar las pruebas a puertos web; aún requiere autorización
nmap -O -p 80,443 TARGET

# Escaneo agresivo
nmap -A TARGET
```

---

## Scripts NSE y Detección de Vulnerabilidades

```bash
# Scripts por defecto
nmap -sC TARGET

# Ejecutar script específico
nmap --script=http-title TARGET

# Ejecutar la categoría "safe" después de revisar su lista actual
nmap --script=safe TARGET

# Escaneo con vulscan
nmap -sV --script=vulscan/vulscan.nse TARGET

# Escaneo con vulners (si está instalado)
nmap -sV --script vulners TARGET
```

---

## Escaneos Avanzados

```bash
# Escaneo agresivo completo
nmap -A TARGET

# Escaneo agresivo de todos los puertos
nmap -p- -A TARGET

# Escaneo completo + scripts NSE
nmap -p- -A -sC TARGET
```

---

## Opciones de Salida

```bash
# Guardar salida en texto
nmap -oN output.txt TARGET

# Guardar en XML
nmap -oX output.xml TARGET

# Guardar en todos los formatos
nmap -oA scan_result TARGET
```

---

## Perfiles Nombrados (Descripciones Cortas)

```bash
nmap_open_ports:         escaneo de puertos abiertos
nmap_list_interfaces:    lista interfaces locales (nmap --iflist)
nmap_slow:               temporización lenta, aún detectable (nmap -T1)
nmap_fin:                escaneo TCP FIN (nmap -sF)
nmap_full:               escaneo completo agresivo (nmap -p- -A)
nmap_check_for_firewall: escaneo ACK (nmap -sA)
nmap_ping_through_firewall: descubrimiento SYN/ACK (nmap -PS -PA)
nmap_fast:               escaneo rápido de puertos comunes (nmap -F)
nmap_detect_versions:    escaneo completo + detección (nmap -sV -O -p-)
nmap_check_for_vulns:    script vulscan (nmap -sV --script=vulscan)
nmap_full_udp:           escaneo completo UDP (nmap -sU -p-)
nmap_traceroute:         habilitar traceroute (nmap --traceroute)
nmap_full_with_scripts:  escaneo completo con scripts (nmap -p- -A -sC)
nmap_web_ports_osscan:   detección limitada a puertos web (nmap -O -p 80,443)
nmap_ping_scan:          descubrimiento sin escaneo de puertos (nmap -sn)
```

---

Los escaneos como `-A`, `--script`, `-sU` y `-p-` pueden generar mucho tráfico, activar
defensas o afectar servicios frágiles. Evita `--script=all`; selecciona scripts explícitos,
revísalos y pruébalos en un laboratorio antes de usarlos en producción con autorización.

— Franco
