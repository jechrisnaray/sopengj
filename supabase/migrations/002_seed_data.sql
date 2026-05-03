-- ========================================================
-- SEED DATA UNTUK KONSULIN
-- ========================================================

-- CATATAN: Jalankan script ini hanya di local development.
-- Di production, gunakan Supabase Auth untuk membuat user,
-- lalu profile otomatis dibuat via trigger handle_new_user().
-- UUID di bawah harus diganti dengan UUID dari auth.users yang valid.

-- 1. INSERT PROFILES
INSERT INTO profiles (id, full_name, avatar_url, role)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Budi Arto, S.H., LL.M.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', 'consultant'),
  ('b2222222-2222-2222-2222-222222222222', 'Sari Keuangan, CFP', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sari', 'consultant'),
  ('c3333333-3333-3333-3333-333333333333', 'Dr. Andi Psikolog, M.Psi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', 'consultant'),
  ('d4444444-4444-4444-4444-444444444444', 'Maya Karir, HRD Professional', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', 'consultant'),
  ('e5555555-5555-5555-5555-555555555555', 'Hendra Bisnis, MBA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra', 'consultant');

-- 2. INSERT CONSULTANTS
INSERT INTO consultants (id, profile_id, bio, specializations, hourly_rate, rating, total_reviews, total_sessions, is_verified, years_experience)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Pengacara spesialis hukum perdata dan korporat dengan pengalaman 10 tahun.', '{Hukum, Perdata, Korporat}', 500000, 4.9, 45, 120, true, 10),
  ('f2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Perencana keuangan bersertifikasi yang fokus pada manajemen kekayaan keluarga.', '{Keuangan, Investasi, Pajak}', 350000, 4.8, 38, 95, true, 7),
  ('f3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'Psikolog klinis berpengalaman menangani kesehatan mental remaja dan dewasa.', '{Psikologi, Kesehatan Mental}', 300000, 4.9, 62, 210, true, 12),
  ('f4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 'HR Consultant yang membantu ribuan orang mendapatkan pekerjaan impian.', '{Karir, HRD, Resume}', 250000, 4.7, 55, 180, true, 8),
  ('f5555555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', 'Serial entrepreneur yang siap membantu startup Anda tumbuh lebih cepat.', '{Bisnis, Startup, Strategi}', 750000, 5.0, 24, 60, true, 15);

-- 3. INSERT AVAILABILITY (Senin - Rabu, 09:00 - 17:00 untuk semua)
DO $$
DECLARE
    cons_id UUID;
    days INTEGER[] := ARRAY[1, 2, 3]; -- Senin, Selasa, Rabu
    d INTEGER;
BEGIN
    FOR cons_id IN SELECT id FROM consultants LOOP
        FOREACH d IN ARRAY days LOOP
            INSERT INTO availability (consultant_id, day_of_week, start_time, end_time)
            VALUES (cons_id, d, '09:00:00', '17:00:00');
        END LOOP;
    END LOOP;
END $$;
