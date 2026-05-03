-- =====================
-- TABEL PROFILES
-- =====================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  avatar_url  TEXT,
  phone       TEXT,
  role        TEXT CHECK (role IN ('user','consultant','admin'))
              DEFAULT 'user',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABEL CONSULTANTS
-- =====================
CREATE TABLE consultants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id       UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  bio              TEXT,
  specializations  TEXT[]  NOT NULL DEFAULT '{}',
  hourly_rate      INTEGER NOT NULL CHECK (hourly_rate > 0),
  rating           DECIMAL(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  total_reviews    INTEGER DEFAULT 0,
  total_sessions   INTEGER DEFAULT 0,
  is_verified      BOOLEAN DEFAULT false,
  is_available     BOOLEAN DEFAULT true,
  years_experience INTEGER DEFAULT 0,
  education        TEXT,
  languages        TEXT[] DEFAULT '{Indonesia}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABEL AVAILABILITY (jadwal mingguan berulang)
-- =====================
CREATE TABLE availability (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id  UUID REFERENCES consultants(id) ON DELETE CASCADE,
  day_of_week    INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  -- 0=Minggu, 1=Senin, ..., 6=Sabtu
  start_time     TIME NOT NULL,
  end_time       TIME NOT NULL,
  is_active      BOOLEAN DEFAULT true,
  UNIQUE (consultant_id, day_of_week, start_time)
);

-- =====================
-- TABEL BOOKINGS
-- =====================
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  consultant_id    UUID REFERENCES consultants(id) ON DELETE SET NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60
                   CHECK (duration_minutes IN (30, 60, 90)),
  status           TEXT CHECK (
                     status IN ('pending','confirmed',
                                'completed','cancelled')
                   ) DEFAULT 'pending',
  topic            TEXT,
  notes            TEXT,
  meeting_url      TEXT,
  total_price      INTEGER NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABEL REVIEWS
-- =====================
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABEL NOTIFICATIONS
-- =====================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT CHECK (
               type IN ('booking_confirmed','booking_cancelled',
                        'session_reminder','review_request')
             ),
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_bookings_user    ON bookings(user_id);
CREATE INDEX idx_bookings_consult ON bookings(consultant_id);
CREATE INDEX idx_bookings_status  ON bookings(status);
CREATE INDEX idx_bookings_sched   ON bookings(scheduled_at);
CREATE INDEX idx_consultants_spec ON consultants
  USING gin(specializations);
CREATE INDEX idx_notif_user       ON notifications(user_id, is_read);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- Profiles: user hanya bisa lihat/edit profil sendiri
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Consultants: semua bisa lihat, hanya pemilik yang bisa edit
CREATE POLICY "consultants_select" ON consultants
  FOR SELECT USING (true);
CREATE POLICY "consultants_update" ON consultants
  FOR UPDATE USING (
    auth.uid() = (SELECT id FROM profiles WHERE id = profile_id)
  );

-- Availability: semua bisa lihat
CREATE POLICY "availability_select" ON availability
  FOR SELECT USING (true);
CREATE POLICY "availability_manage" ON availability
  FOR ALL USING (
    auth.uid() = (
      SELECT p.id FROM profiles p
      JOIN consultants c ON c.profile_id = p.id
      WHERE c.id = consultant_id
    )
  );

-- Bookings: hanya user terkait yang bisa lihat
CREATE POLICY "bookings_select" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() = (
      SELECT p.id FROM profiles p
      JOIN consultants c ON c.profile_id = p.id
      WHERE c.id = consultant_id
    )
  );
CREATE POLICY "bookings_insert" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_update" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR
    auth.uid() = (
      SELECT p.id FROM profiles p
      JOIN consultants c ON c.profile_id = p.id
      WHERE c.id = consultant_id
    )
  );

-- Reviews: semua bisa lihat
CREATE POLICY "reviews_select" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notifications: hanya milik sendiri
CREATE POLICY "notif_select" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================
-- FUNCTION: Auto-create profile setelah register
-- =====================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
