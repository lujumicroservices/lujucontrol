-- Auto-generated SQL schema


-- Table: payment_transaction
CREATE TABLE IF NOT EXISTS payment_transaction (
  id UUID PRIMARY KEY,
  player_id VARCHAR(50) NULL,
  amount TEXT NULL,
  billing_period VARCHAR(255) NULL,
  due_date VARCHAR(255) NULL,
  payment_date VARCHAR(255) NULL,
  status TEXT NULL,
  late_fee TEXT NULL,
  created_at TEXT NULL,
  updated_at TEXT NULL
);

-- Alter Table: payment_transaction
ALTER TABLE payment_transaction ADD COLUMN IF NOT EXISTS player_id VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS amount TEXT NULL, ADD COLUMN IF NOT EXISTS billing_period VARCHAR(255) NULL, ADD COLUMN IF NOT EXISTS due_date VARCHAR(255) NULL, ADD COLUMN IF NOT EXISTS payment_date VARCHAR(255) NULL, ADD COLUMN IF NOT EXISTS status TEXT NULL, ADD COLUMN IF NOT EXISTS late_fee TEXT NULL, ADD COLUMN IF NOT EXISTS created_at TEXT NULL, ADD COLUMN IF NOT EXISTS updated_at TEXT NULL;

-- Table: player
CREATE TABLE IF NOT EXISTS player (
  id UUID PRIMARY KEY,
  first_name VARCHAR(50) NULL,
  last_name VARCHAR(50) NULL,
  birth_date TEXT NULL,
  jersey_number TEXT NULL,
  position TEXT NULL,
  team_name VARCHAR(100) NULL,
  medical_conditions VARCHAR(500) NULL,
  created_at TEXT NULL,
  updated_at TEXT NULL
);

-- Alter Table: player
ALTER TABLE player ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS birth_date TEXT NULL, ADD COLUMN IF NOT EXISTS jersey_number TEXT NULL, ADD COLUMN IF NOT EXISTS position TEXT NULL, ADD COLUMN IF NOT EXISTS team_name VARCHAR(100) NULL, ADD COLUMN IF NOT EXISTS medical_conditions VARCHAR(500) NULL, ADD COLUMN IF NOT EXISTS created_at TEXT NULL, ADD COLUMN IF NOT EXISTS updated_at TEXT NULL;

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY,
  description VARCHAR(50) NULL,
  monthly_cost TEXT NULL,
  annual_cost TEXT NULL,
  default_payment_due_day TEXT NULL,
  max_late_days TEXT NULL,
  late_fee_percentage TEXT NULL,
  created_at TEXT NULL,
  updated_at TEXT NULL
);

-- Alter Table: settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS description VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS monthly_cost TEXT NULL, ADD COLUMN IF NOT EXISTS annual_cost TEXT NULL, ADD COLUMN IF NOT EXISTS default_payment_due_day TEXT NULL, ADD COLUMN IF NOT EXISTS max_late_days TEXT NULL, ADD COLUMN IF NOT EXISTS late_fee_percentage TEXT NULL, ADD COLUMN IF NOT EXISTS created_at TEXT NULL, ADD COLUMN IF NOT EXISTS updated_at TEXT NULL;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  user_name VARCHAR(50) NULL,
  first_name VARCHAR(50) NULL,
  last_name VARCHAR(50) NULL,
  password VARCHAR(50) NULL,
  created_at TEXT NULL,
  updated_at TEXT NULL
);

-- Alter Table: users
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_name VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS password VARCHAR(50) NULL, ADD COLUMN IF NOT EXISTS created_at TEXT NULL, ADD COLUMN IF NOT EXISTS updated_at TEXT NULL;
