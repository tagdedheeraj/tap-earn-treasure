
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create coins wallet table
CREATE TABLE public.coin_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  total_coins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

-- Create coin transactions table
CREATE TABLE public.coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned' or 'spent'
  source TEXT NOT NULL, -- 'mining', 'quiz', 'referral', 'ad', 'task', 'redemption'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create mining sessions table
CREATE TABLE public.mining_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  coins_mined INTEGER NOT NULL DEFAULT 0,
  mining_progress INTEGER NOT NULL DEFAULT 0,
  last_mining_time TIMESTAMP WITH TIME ZONE,
  can_mine_next TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

-- Create quiz sessions table
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  last_quiz_date DATE,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

-- Create tasks table
CREATE TABLE public.user_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  completed_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(user_id, task_type)
);

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  coins_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for coin_wallets
CREATE POLICY "Users can view their own wallet" ON public.coin_wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.coin_wallets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON public.coin_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for coin_transactions
CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for mining_sessions
CREATE POLICY "Users can view their own mining session" ON public.mining_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own mining session" ON public.mining_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mining session" ON public.mining_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for quiz_sessions
CREATE POLICY "Users can view their own quiz session" ON public.quiz_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own quiz session" ON public.quiz_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz session" ON public.quiz_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_tasks
CREATE POLICY "Users can view their own tasks" ON public.user_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.user_tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON public.user_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for redemptions
CREATE POLICY "Users can view their own redemptions" ON public.redemptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own redemptions" ON public.redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := 'REF' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle referral bonus
CREATE OR REPLACE FUNCTION public.process_referral_bonus(referrer_code TEXT, new_user_id UUID)
RETURNS VOID AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Find referrer by code
  SELECT id INTO referrer_id
  FROM public.profiles
  WHERE referral_code = referrer_code;
  
  IF referrer_id IS NOT NULL THEN
    -- Update new user's referred_by
    UPDATE public.profiles
    SET referred_by = referrer_id
    WHERE id = new_user_id;
    
    -- Give 1000 coins to referrer
    UPDATE public.coin_wallets
    SET total_coins = total_coins + 1000,
        updated_at = NOW()
    WHERE user_id = referrer_id;
    
    -- Give 500 coins to new user
    UPDATE public.coin_wallets
    SET total_coins = total_coins + 500,
        updated_at = NOW()
    WHERE user_id = new_user_id;
    
    -- Record transactions
    INSERT INTO public.coin_transactions (user_id, amount, transaction_type, source, description)
    VALUES 
      (referrer_id, 1000, 'earned', 'referral', 'Referral bonus for inviting new user'),
      (new_user_id, 500, 'earned', 'referral', 'Welcome bonus for joining with referral code');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
