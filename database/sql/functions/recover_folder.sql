
-- Method to recover folder and all its files and subfolders
 CREATE OR REPLACE FUNCTION recover_folder(folder_id UUID, target_folder UUID)
 RETURNS boolean
  LANGUAGE 'plpgsql'
  AS $BODY$
   DECLARE
      row RECORD;
  BEGIN

    UPDATE Folder SET parent_id=target_folder, is_deleted=FALSE, delete_date=NULL
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
            ) SELECT id, is_directory, name FROM children WHERE is_deleted IS TRUE
    LOOP
        -- Check if row (file/folder) is folder or file
        IF row.is_directory IS TRUE THEN
            -- is file, do update on
            UPDATE Folder SET is_deleted=FALSE, delete_date=NULL
            WHERE id = row.id;
        ELSE
            UPDATE File
            SET is_deleted=FALSE, delete_date=NULL
            WHERE id = row.id;
        END IF;
    END LOOP;
    RETURN TRUE;
END;
$BODY$;