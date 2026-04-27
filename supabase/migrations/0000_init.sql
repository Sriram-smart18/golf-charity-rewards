-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Charities Table
CREATE TABLE public.charities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    mission TEXT,
    impact TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    charity_id UUID REFERENCES public.charities(id),
    contribution_percent INTEGER DEFAULT 10 CHECK (contribution_percent >= 10),
    subscription_status TEXT DEFAULT 'inactive',
    subscription_plan TEXT,
    stripe_customer_id TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, charity_id, contribution_percent, subscription_plan)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    NULLIF(new.raw_user_meta_data->>'charity_id', '')::uuid,
    COALESCE((new.raw_user_meta_data->>'contribution_percent')::integer, 10),
    new.raw_user_meta_data->>'subscription_plan'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Scores Table
CREATE TABLE public.scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, date)
);

-- Draws Table
CREATE TABLE public.draws (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    numbers INTEGER[] NOT NULL,
    mode TEXT CHECK (mode IN ('random', 'weighted')) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
    prize_pool DECIMAL DEFAULT 0.00,
    matches_5_prize DECIMAL DEFAULT 0.00,
    matches_4_prize DECIMAL DEFAULT 0.00,
    matches_3_prize DECIMAL DEFAULT 0.00,
    rollover_amount DECIMAL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winners Table
CREATE TABLE public.winners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
    match_count INTEGER CHECK (match_count IN (3, 4, 5)),
    prize_amount DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table (Stripe mapping)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Charities Policies
CREATE POLICY "Charities are viewable by everyone." ON public.charities FOR SELECT USING (true);

-- Profiles Policies
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Scores Policies
CREATE POLICY "Users can view their own scores." ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scores." ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scores." ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Draws Policies
CREATE POLICY "Published draws are viewable by everyone." ON public.draws FOR SELECT USING (status = 'published');

-- Winners Policies
CREATE POLICY "Users can view their own winnings." ON public.winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own proof url." ON public.winners FOR UPDATE USING (auth.uid() = user_id);

-- Admins can do everything (simplified policy assuming is_admin check in app logic or via JWT claims, here we'll just rely on service role key for admin tasks in API routes)
