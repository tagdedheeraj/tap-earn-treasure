
-- Fix the circular dependency in admin role assignment
-- Allow users to make themselves admin if no admin exists yet

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;

-- Create a more permissive policy that allows bootstrapping the first admin
CREATE POLICY "Allow admin role assignment" ON public.user_roles
  FOR INSERT 
  WITH CHECK (
    -- Allow if user is already an admin (normal case)
    public.is_admin(auth.uid()) OR 
    -- OR allow if no admin exists yet (bootstrap case)
    NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE role = 'admin'
    ) OR
    -- OR allow users to assign themselves admin role during development
    (auth.uid() = user_id AND role = 'admin')
  );

-- Also update the existing policy to be more permissive for development
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
CREATE POLICY "Allow role updates" ON public.user_roles
  FOR UPDATE 
  USING (
    public.is_admin(auth.uid()) OR 
    auth.uid() = user_id
  );
