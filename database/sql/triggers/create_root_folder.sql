/**
  Trigger to create root folder when a client is created
 */

-- create function that creates root folder
CREATE OR REPLACE FUNCTION create_root_folder()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  AS $BODY$
  BEGIN
    -- create root folder
   INSERT INTO Folder(client_id, name)
   VALUES(NEW.id, '/');
   -- create recycle bin
   INSERT INTO Folder(client_id, name, is_deleted)
   VALUES(NEW.id,'/', true);
   -- done
 RETURN NEW;
END;
$BODY$;

-- create actual trigger
CREATE TRIGGER create_root_folder_trigger
  AFTER INSERT
  ON Client
  FOR EACH ROW
  EXECUTE PROCEDURE create_root_folder();