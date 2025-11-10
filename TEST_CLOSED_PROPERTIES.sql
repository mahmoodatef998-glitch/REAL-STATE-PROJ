-- Script to create test closed properties
-- Run this in Prisma Studio or PostgreSQL

-- 1. Check current properties and their statuses
SELECT id, title, status, owner_id 
FROM properties 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Update some properties to 'closed' for testing
-- Replace IDs with actual property IDs from your database
UPDATE properties 
SET status = 'closed', updated_at = NOW()
WHERE id IN (
  SELECT id FROM properties 
  WHERE status = 'active' 
  LIMIT 2
);

-- 3. Update some properties to 'sold' for testing
UPDATE properties 
SET status = 'sold', updated_at = NOW()
WHERE id IN (
  SELECT id FROM properties 
  WHERE status = 'available' 
  LIMIT 1
);

-- 4. Verify the changes
SELECT id, title, status, owner_id 
FROM properties 
WHERE status IN ('closed', 'sold', 'rented')
ORDER BY updated_at DESC;

-- Expected result: You should see properties with closed/sold status

