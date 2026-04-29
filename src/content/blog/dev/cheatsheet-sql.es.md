+++
title = 'Cheatsheet: SQL'
date = '2025-05-21'
description = 'SQL - guia de referencia donde cubre  SELECTs, INSERTs, UPDATEs, JOINs, etc'
tags = ['sql', 'database', 'cheatsheet', 'dev']
+++

Esta guia está basada en notas que he recopilado con el tiempo. Aplica para PostgreSQL, MySQL o SQLite. Los comandos cubren consultas, filtrado, modificación y unión de datos.
<!--more-->

---

## SELECT - Consultas Básicas

```SQL
-- Selecciona todo de una tabla
SELECT * FROM Country;

-- Renombrar columnas usando AS y ordenar alfabéticamente
SELECT Name, Lifeexpectancy AS "Esperanza de Vida" FROM Country ORDER BY Name;

-- Consulta condicional con LIMIT y OFFSET
SELECT Name, Continent, Region 
FROM Country 
WHERE Continent = 'Europe' 
ORDER BY Name 
LIMIT 5 OFFSET 15;

-- Contar países con población mayor a un millón
SELECT COUNT(*) FROM Country WHERE Population > 1000000;

-- Eliminar duplicados (DISTINCT)
SELECT DISTINCT Continent FROM Country;
```

---

## Filtrado con WHERE

```SQL
-- Filtrar por múltiples condiciones
SELECT Name, Continent, Population 
FROM Country 
WHERE Population < 10000 AND Continent = 'Oceania' 
ORDER BY Population DESC;

-- Usar LIKE con comodines
SELECT Name FROM Country WHERE Name LIKE '%island%' ORDER BY Name;

-- Segunda letra sea A
SELECT Name FROM Country WHERE Name LIKE '_a%' ORDER BY Name;
```

---

## INSERTAR Datos

```SQL
-- Insertar datos en columnas específicas
INSERT INTO customer (name, city, state) 
VALUES ('Jimi', 'Renton', 'WA');

-- Insertar datos desde otra tabla
INSERT INTO test (a, b, c) 
SELECT id, name, description FROM item;
```

---

## ACTUALIZAR y ELIMINAR

```SQL
-- Actualizar campos específicos por ID
UPDATE customer 
SET address = '123 music ave', zip = '98056' 
WHERE id = 5;

-- Eliminar un registro específico
DELETE FROM customer WHERE id = 5;
```

---

## Estructura de la Tabla

```SQL
-- Eliminar tabla si existe
DROP TABLE IF EXISTS test;

-- Añadir una columna con valor por defecto
ALTER TABLE test ADD columna TEXT DEFAULT 'panda';
```

---

## Unir Tablas (JOINs)

```SQL
-- Inner Join
SELECT customers.name, orders.amount 
FROM customers 
INNER JOIN orders ON customers.id = orders.customer_id;

-- Left Join
SELECT customers.name, orders.amount 
FROM customers 
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Right Join (no soportado en todas las bases de datos)
SELECT customers.name, orders.amount 
FROM customers 
RIGHT JOIN orders ON customers.id = orders.customer_id;

-- Full Outer Join (PostgreSQL)
SELECT customers.name, orders.amount 
FROM customers 
FULL OUTER JOIN orders ON customers.id = orders.customer_id;
```

---

## Agregación y Agrupación

```SQL
-- Agrupar datos y contar registros
SELECT Continent, COUNT(*) as total_paises 
FROM Country 
GROUP BY Continent;

-- Promedio de población por región
SELECT Region, AVG(Population) as promedio_poblacion 
FROM Country 
GROUP BY Region;
```

---

## Otros Comandos Útiles

```SQL
-- Encontrar máximos y mínimos
SELECT MAX(Population), MIN(LifeExpectancy) FROM Country;

-- Ordenar por múltiples columnas
SELECT Name, Continent, Population 
FROM Country 
ORDER BY Continent, Population DESC;

-- Limitar el número de resultados
SELECT * FROM Country LIMIT 10;
```

Esta guia está pensada como una referencia rápida para el diario.

— Franco