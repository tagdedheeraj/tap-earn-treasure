
-- Replace 'admin@gmail.com' with your actual email address
-- Check what users exist and their emails first
SELECT id, email FROM auth.users;

-- Add admin role to a specific user (replace the email with your actual email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'admin@gmail.com'  -- Replace with your email
ON CONFLICT (user_id, role) DO NOTHING;
