CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  price DECIMAL(5, 2) NOT NULL,
  model VARCHAR(120) NOT NULL,
  color VARCHAR(120) NOT NULL,
  transmission_type VARCHAR(100) CHECK (transmission_type IN ('manual', 'automatic')) DEFAULT 'automatic',
  release_year INTEGER CHECK (release_year < 9999) NOT NULL,
  brand_id INTEGER REFERENCES brands(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
