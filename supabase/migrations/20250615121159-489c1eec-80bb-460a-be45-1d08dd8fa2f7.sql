
-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create admin_settings table for app configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_actions table for logging admin activities
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  );
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create RLS policies for admin_settings
CREATE POLICY "Admins can manage settings" ON public.admin_settings
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for admin_actions
CREATE POLICY "Admins can view admin actions" ON public.admin_actions
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert admin actions" ON public.admin_actions
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, description) VALUES
  ('daily_spin_limit', '3', 'Maximum daily spins allowed per user'),
  ('mining_cooldown_hours', '24', 'Hours between mining sessions'),
  ('mining_reward_amount', '100', 'Coins awarded per mining session'),
  ('referral_bonus_referrer', '100', 'Bonus coins for referrer when friend completes first mining'),
  ('referral_bonus_new_user', '500', 'Welcome bonus for new users with referral code'),
  ('app_maintenance_mode', 'false', 'Enable/disable maintenance mode');

-- Function to automatically assign user role to new users
CREATE OR REPLACE FUNCTION public.assign_default_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign default role to new users
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_user_role();
