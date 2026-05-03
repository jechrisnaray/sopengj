-- PERBAIKAN 13: Auto-Update Rating & Review Count
CREATE OR REPLACE FUNCTION update_consultant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE consultants
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE consultant_id = NEW.consultant_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE consultant_id = NEW.consultant_id
    )
  WHERE id = NEW.consultant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_consultant_rating();

-- PERBAIKAN 14: RLS Policy INSERT untuk Consultants
CREATE POLICY "consultants_insert" ON consultants
  FOR INSERT WITH CHECK (
    auth.uid() = profile_id
    AND
    (SELECT role FROM profiles WHERE id = profile_id) = 'consultant'
  );
