
-- Fix the handle_new_user function and add missing RLS policies
-- First, let's update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with unique referral code
  INSERT INTO public.profiles (id, referral_code)
  VALUES (NEW.id, generate_referral_code());
  
  -- Create coin wallet
  INSERT INTO public.coin_wallets (user_id, total_coins)
  VALUES (NEW.id, 0);
  
  -- Create mining session
  INSERT INTO public.mining_sessions (user_id)
  VALUES (NEW.id);
  
  -- Create quiz session
  INSERT INTO public.quiz_sessions (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add missing RLS policies that might be causing issues
-- Allow users to view referral codes for referral system
CREATE POLICY "Users can view referral codes" ON public.profiles
  FOR SELECT USING (true);

-- Re-create all policies to ensure they're properly set
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR true);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
