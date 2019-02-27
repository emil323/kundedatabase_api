-- Method to move file or folder to recyclebin
 CREATE OR REPLACE FUNCTION delete_folder(folder_id UUID)
 RETURNS boolean
  LANGUAGE 'plpgsql'
  AS $BODY$
   DECLARE
      client UUID;
      recycle_bin UUID;
      row RECORD;
  BEGIN
    -- get client ID
    SELECT F.client_id INTO client
        FROM Folder AS F
        WHERE F.id = folder_id
        AND F.parent_id IS NOT NULL; -- verify that the folder to be deleted is not root
    IF FOUND THEN
      -- Get recycle_bin root
      SELECT F.id INTO recycle_bin
      FROM Folder AS F
      WHERE F.client_id = client
      AND F.is_deleted IS TRUE
      AND F.parent_id IS NULL; -- to get the root recycle bin
        -- Delete folder
        IF FOUND THEN
          UPDATE Folder SET parent_id=recycle_bin, is_deleted=TRUE, delete_date=NOW()
          WHERE id=folder_id;
          -- Delete the children (the juicy part)
          FOR row IN
            -- Recursive query to get all children in a parent
            WITH RECURSIVE children AS(
                 SELECT *
                 FROM FilesAndFolders
                 WHERE parent_id = folder_id
                 UNION
                 SELECT R.*
                 FROM FilesAndFolders AS R
                 JOIN children RT ON RT.id = R.parent_id
                ) SELECT id, is_directory, name FROM children WHERE is_deleted IS FALSE
          LOOP
            -- Check if row (file/folder) is folder or file
            IF row.is_directory IS TRUE THEN
                -- is file, do update on
                UPDATE Folder SET is_deleted=TRUE, delete_date=NOW()
                WHERE id = row.id;
              ELSE
                UPDATE File
                SET is_deleted=TRUE, delete_date=NOW()
                WHERE id = row.id;
              END IF;
          END LOOP;
          RETURN TRUE;
    END IF;
    ELSE
      RAISE 'UNKNOWN_CLIENT_OR_INVALID_FOLDER';
    END IF;
END;
$BODY$;