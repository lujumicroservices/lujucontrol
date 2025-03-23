-- Insert demo data into facility
INSERT INTO facility (id, name, type, capacity, rules) VALUES
  (gen_random_uuid(), 'Community Pool', 'Recreational', '50', 'No food or drinks allowed.'),
  (gen_random_uuid(), 'Tennis Court', 'Sports', '4', 'Only non-marking shoes allowed.');

-- Insert demo data into fee
INSERT INTO fee (id, property_id, amount, due_date, status) VALUES
  (gen_random_uuid(), 'P001', '500', '2025-03-01', 'Pending'),
  (gen_random_uuid(), 'P002', '750', '2025-03-10', 'Paid');

-- Insert demo data into maintenance
INSERT INTO maintenance (id, property_id, issue_type, description, status) VALUES
  (gen_random_uuid(), 'P001', 'Plumbing', 'Leaking pipe in the kitchen', 'Open'),
  (gen_random_uuid(), 'P002', 'Electrical', 'Power outage in common area', 'In Progress');

-- Insert demo data into property
INSERT INTO property (id, address, unit_number, size, type, owner_id) VALUES
  (gen_random_uuid(), '123 Main St', 'A1', '1200 sqft', 'Apartment', 'O001'),
  (gen_random_uuid(), '456 Oak Rd', 'B2', '1500 sqft', 'Townhouse', 'O002');

-- Insert demo data into resident
INSERT INTO resident (id, first_name, last_name, email, phone, property_id, role) VALUES
  (gen_random_uuid(), 'John', 'Doe', 'john.doe@example.com', '555-1234', 'P001', 'Owner'),
  (gen_random_uuid(), 'Jane', 'Smith', 'jane.smith@example.com', '555-5678', 'P002', 'Tenant');

-- Insert demo data into rule
INSERT INTO rule (id, title, description, category) VALUES
  (gen_random_uuid(), 'No Loud Music', 'Residents must keep noise levels low after 10 PM.', 'Community'),
  (gen_random_uuid(), 'Trash Disposal', 'Garbage must be placed in designated bins.', 'Sanitation');

-- Insert demo data into violation
INSERT INTO violation (id, property_id, violation_type, description, status) VALUES
  (gen_random_uuid(), 'P001', 'Noise', 'Loud music after midnight', 'Resolved'),
  (gen_random_uuid(), 'P002', 'Unauthorized Pet', 'Dog found in a no-pet unit', 'Pending');



INSERT INTO players (
    first_name, last_name, birth_date, jersey_number, position, team_name, 
    address, city, state, zip_code, 
    parent_name, parent_email, parent_phone_1, parent_phone_2, parent_phone_3, 
    medical_conditions
) VALUES 
(
    'Diego', 'Ramírez', '2012-05-10', 10, 'Midfielder', 'Chivas Sub-12',
    'Calle Reforma 120', 'Guadalajara', 'Jalisco', '44100',
    'Juan Ramírez', 'juan.ramirez@example.com', '3312345678', '3318765432', '3319876543',
    'Ninguna'
),
(
    'Emiliano', 'González', '2011-08-15', 7, 'Forward', 'Pumas Cantera',
    'Av. Universidad 2000', 'Ciudad de México', 'CDMX', '04510',
    'Laura Hernández', 'laura.hernandez@example.com', '5512345678', '5518765432', NULL,
    'Asma leve'
),
(
    'Santiago', 'López', '2013-03-22', 1, 'Goalkeeper', 'Monterrey Juvenil',
    'Av. Constitución 500', 'Monterrey', 'Nuevo León', '64000',
    'Roberto López', 'roberto.lopez@example.com', '8112345678', NULL, NULL,
    'Hipertensión infantil'
),
(
    'Javier', 'Martínez', '2012-12-05', 5, 'Defender', 'Atlas Academia',
    'Calle Independencia 350', 'Zapopan', 'Jalisco', '45100',
    'Ana Martínez', 'ana.martinez@example.com', '3315558888', '3316667777', NULL,
    NULL
),
(
    'Matías', 'Fernández', '2010-06-18', 3, 'Defender', 'León Juvenil',
    'Blvd. Adolfo López Mateos 1800', 'León', 'Guanajuato', '37000',
    'Carlos Fernández', 'carlos.fernandez@example.com', '4771234567', NULL, NULL,
    'Alergia a mariscos'
);