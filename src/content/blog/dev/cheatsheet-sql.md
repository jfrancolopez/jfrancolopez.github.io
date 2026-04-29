+++
title = 'Cheatsheet: SQL'
date = '2025-05-21'
description = 'SQL reference guide covering SELECTs, INSERTs, UPDATEs, JOINs, etc'
tags = ['sql', 'database', 'cheatsheet', 'dev']
+++

This cheatsheet is built from my notes collected over time. Can apply to PostgreSQL, MySQL, or SQLite, these commands are for querying, filtering, modifying, and joining data.
<!--more-->

---

## SELECT Statements

```SQL
-- Select everything from a table
SELECT * FROM Country;

-- Rename columns using AS and order alphabetically
SELECT Name, Lifeexpectancy AS "Life Expectancy" FROM Country ORDER BY Name;

-- Conditional query with LIMIT and OFFSET
SELECT Name, Continent, Region 
FROM Country 
WHERE Continent = 'Europe' 
ORDER BY Name 
LIMIT 5 OFFSET 15;

-- Count how many countries have population over 1 million
SELECT COUNT(*) FROM Country WHERE Population > 1000000;

-- Remove duplicates (DISTINCT)
SELECT DISTINCT Continent FROM Country;
```

---

## Filtering with WHERE

```SQL
-- Filter by multiple conditions
SELECT Name, Continent, Population 
FROM Country 
WHERE Population < 10000 AND Continent = 'Oceania' 
ORDER BY Population DESC;

-- Use LIKE and wildcards
SELECT Name FROM Country WHERE Name LIKE '%island%' ORDER BY Name;

-- Second letter is A
SELECT Name FROM Country WHERE Name LIKE '_a%' ORDER BY Name;
```

---

## INSERT Statements

```SQL
-- Insert data into specified columns
INSERT INTO customer (name, city, state) 
VALUES ('Jimi', 'Renton', 'WA');

-- Insert values from another table
INSERT INTO test (a, b, c) 
SELECT id, name, description FROM item;
```

---

## UPDATE and DELETE

```SQL
-- Update specific fields by ID
UPDATE customer 
SET address = '123 music ave', zip = '98056' 
WHERE id = 5;

-- Delete a specific record
DELETE FROM customer WHERE id = 5;
```

---

## Table Structure

```SQL
-- Drop table if it exists
DROP TABLE IF EXISTS test;

-- Add a new column with a default value
ALTER TABLE test ADD columna TEXT DEFAULT 'panda';
```

---

## JOIN Statements

```SQL
-- Inner Join
SELECT customers.name, orders.amount 
FROM customers 
INNER JOIN orders ON customers.id = orders.customer_id;

-- Left Join
SELECT customers.name, orders.amount 
FROM customers 
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Right Join (may not be supported in all DBs)
SELECT customers.name, orders.amount 
FROM customers 
RIGHT JOIN orders ON customers.id = orders.customer_id;

-- Full Outer Join (PostgreSQL)
SELECT customers.name, orders.amount 
FROM customers 
FULL OUTER JOIN orders ON customers.id = orders.customer_id;
```

---

## Aggregation & Grouping

```SQL
-- Group data and get counts
SELECT Continent, COUNT(*) as total_countries 
FROM Country 
GROUP BY Continent;

-- Average population by region
SELECT Region, AVG(Population) as avg_pop 
FROM Country 
GROUP BY Region;
```

---

## Other Useful Commands

```SQL
-- Find max/min values
SELECT MAX(Population), MIN(LifeExpectancy) FROM Country;

-- Order by multiple columns
SELECT Name, Continent, Population 
FROM Country 
ORDER BY Continent, Population DESC;

-- Limit number of results
SELECT * FROM Country LIMIT 10;
```

This cheatsheet is meant to be a quick reference.
  

— Franco