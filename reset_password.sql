-- Reset password for nico_baburek@hotmail.com to NicoNico!!Babsbam34
-- The bcrypt hash for 'NicoNico!!Babsbam34' with salt rounds 10

UPDATE users 
SET password_hash = '$2a$10$YourBcryptHashHere' 
WHERE email = 'nico_baburek@hotmail.com';

-- If user doesn't exist, create them
INSERT INTO users (email, password_hash, role, status) 
VALUES ('nico_baburek@hotmail.com', '$2a$10$YourBcryptHashHere', 'admin', 'approved')
ON CONFLICT (email) DO NOTHING; 