
-- Create a default admin user account
-- This will insert a user directly into the auth.users table and assign admin role

-- First, let's create the admin user (this is a simplified approach for demo purposes)
-- In production, you should use Supabase Auth signup flow

-- Add admin role to the existing user or create policies for a specific email
-- Let's check if we can create a test admin account

-- For now, let's just make sure the first registered user gets admin access
-- Update the migration to give admin role to the first user who signs up

DO $$ 
DECLARE
    first_user_id uuid;
BEGIN
    -- Get the first user from auth.users
    SELECT id INTO first_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- If a user exists, make them admin
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (first_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;

-- Also, let's create a policy to automatically make the first user admin
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the first user
    IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically make first user admin
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON auth.users;
CREATE TRIGGER make_first_user_admin_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.make_first_user_admin();
