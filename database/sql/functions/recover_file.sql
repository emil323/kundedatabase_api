
 CREATE OR REPLACE FUNCTION recover_file(file_id UUID, target_folder UUID)
 RETURNS boolean
  LANGUAGE 'plpgsql'
  AS $BODY$
  BEGIN
    UPDATE File SET folder_id=target_folder, is_deleted=FALSE, delete_date=NULL
    WHERE id=file_id;
    RETURN TRUE;
END;
$BODY$;