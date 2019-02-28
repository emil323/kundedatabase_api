CREATE OR REPLACE VIEW FilesToDelete AS (
SELECT id, is_directory, ref
FROM FilesAndFolders
WHERE is_deleted IS TRUE -- Make sure items are deleted
  AND permanently_deleted IS FALSE -- Don't remove something twice
  AND is_root IS FALSE -- make sure not to include root in deletion, that would be bad
  AND date_part('days',NOW() - delete_date) > 1); -- More than two weeks