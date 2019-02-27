
-- Function to delete a single file

 CREATE OR REPLACE FUNCTION delete_file(file_id UUID)
 RETURNS boolean
  LANGUAGE 'plpgsql'
  AS $BODY$
   DECLARE
      client UUID;
      recycle_bin UUID;
  BEGIN
    -- get client ID
      SELECT D.client_id INTO client
        FROM File AS F, Folder AS D
        WHERE F.id = file_id
        AND F.folder_id = D.id;
    IF FOUND THEN
      -- Get recycle_bin root
      SELECT F.id INTO recycle_bin
      FROM Folder AS F
      WHERE F.client_id = client
      AND F.is_deleted IS TRUE
      AND F.parent_id IS NULL; -- to get the root recycle bin
        -- Move file to recycle bin root
        IF FOUND THEN
          UPDATE File SET folder_id=recycle_bin, is_deleted=TRUE, delete_date=NOW()
          WHERE id=file_id;
          RETURN TRUE;
    END IF;
    ELSE
      RAISE 'UNKNOWN_CLIENT_OR_INVALID_FOLDER';
    END IF;
END;
$BODY$;
