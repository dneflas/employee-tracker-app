INSERT INTO departments (name)
VALUES
    ('Pharmacy'),
    ('Optometry'),
    ('Clinical Care');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Pharmacy Manager', 180000.00, 1),
    ('Pharmacist', 150000.00, 1),
    ('Phamacy Technician', 75000.00, 1),
    ('Pharmacy Clerk', 60000.00, 1),
    ('Optometry Manager', 100000.00, 2),
    ('Optometrist', 150000.00, 2),
    ('Optician', 80000.00, 2),
    ('Customer Service Representative', 60000.00, 2),
    ('Clinical Care Manager', 250000.00, 3),
    ('Physician', 200000.00, 3),
    ('Nurse Practicioner', 180000.00, 3),
    ('Physician Assistant', 140000.00, 3),
    ('RN', 90000.00, 3),
    ('LVN', 80000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Kaya', 'Broadhurst', 1, NULL),
    ('Che', 'Langley', 2, 1),
    ('Kelly', 'Felix', 3, 1),
    ('Julia', 'Knox', 5, NULL),
    ('Clarice', 'Sexton', 6, 5),
    ('Zarah', 'Garner', 7, 5),
    ('Terence', 'Clarke', 9, NULL),
    ('Saima', 'Moran', 10, 9),
    ('Briana', 'Drew', 13, 9),
    ('Antoinette', 'Farmer', 14, 9);

