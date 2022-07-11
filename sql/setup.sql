-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

CREATE TABLE users (
  id INTEGER  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
  id INTEGER  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  complete BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);