CREATE DATABASE reviews_api;

\c reviews_api;

CREATE TABLE reviews (
  id INT,
  product_id INT,
  rating INT,
  date date,
  summary VARCHAR,
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness INT
);

CREATE TABLE reviews_stage (
  id VARCHAR,
  product_id VARCHAR,
  rating VARCHAR,
  date VARCHAR,
  summary VARCHAR,
  body VARCHAR,
  recommend VARCHAR,
  reported VARCHAR,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness VARCHAR
);

CREATE TABLE characteristic_review (
  id INT PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  value INT,
);

CREATE TABLE characteristics (
  id INT PRIMARY KEY,
  product_id INT,
  name VARCHAR
);

CREATE TABLE reviews_photos (
  id INT PRIMARY KEY,
  review_id INT,
  url VARCHAR
);
