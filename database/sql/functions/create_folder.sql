 CREATE OR REPLACE FUNCTION create_folder(selected_folder UUID, new_name text)
 RETURNS boolean
  LANGUAGE 'plpgsql'
  AS $BODY$
   DECLARE
      client_id UUID;
  BEGIN
    SELECT F.client_id INTO client_id
        FROM Folder AS F
        WHERE F.id = selected_folder;
    IF FOUND THEN
     INSERT INTO Folder(client_id, parent_id, name)
     VALUES(client_id, selected_folder, new_name);
     RETURN TRUE;
    ELSE
      RAISE 'FOLDER_NOT_FOUND';
    END IF;
END;
$BODY$;
