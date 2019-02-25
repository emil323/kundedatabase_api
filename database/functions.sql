
DROP DATABASE IF EXISTS kundedb;
CREATE DATABASE kundedb;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE Consultant (
  id UUID DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  CONSTRAINT Consultant_PK PRIMARY KEY(id)
);

CREATE TABLE Client (
  id UUID DEFAULT gen_random_uuid(),
  name CITEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  delete_date TIMESTAMP,
  permanently_deleted BOOLEAN DEFAULT FALSE,
  CONSTRAINT Client_UQ UNIQUE(name),
  CONSTRAINT Client_PK PRIMARY KEY(id)
);

CREATE TABLE Favourites (
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  CONSTRAINT Favourites_PK PRIMARY KEY (user_id, client_id),
  CONSTRAINT Favourites_Consultant_FK FOREIGN KEY (user_id)
    REFERENCES Consultant(id),
  CONSTRAINT Favourites_Client_FK FOREIGN KEY (client_id)
    REFERENCES Client(id)
);

CREATE TABLE Folder (
  id UUID DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  parent_id UUID,
  name CITEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  delete_date TIMESTAMP,
  permanently_deleted BOOLEAN DEFAULT FALSE,
  last_changed TIMESTAMP DEFAULT NOW(),
  CONSTRAINT Folder_PK PRIMARY KEY (id),
  CONSTRAINT Folder_UQ UNIQUE(parent_id, name),
  CONSTRAINT Folder_Client_FK FOREIGN KEY (client_id)
    REFERENCES Client(id),
  CONSTRAINT Folder_Folder_DK FOREIGN KEY (parent_id)
    REFERENCES Folder(id)
);


CREATE TABLE File (
  id UUID DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL,
  name CITEXT NOT NULL,
  ref VARCHAR(250),
  type TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  delete_date TIMESTAMP,
  permanently_deleted BOOLEAN DEFAULT FALSE,
  last_changed TIMESTAMP DEFAULT NOW(),
  CONSTRAINT File_UQ UNIQUE (folder_id,name),
  CONSTRAINT File_PK PRIMARY KEY (id),
  FOREIGN KEY (folder_id) REFERENCES Folder(id)
);

CREATE TYPE AccessType AS ENUM ('VIEW_FILE', 'RENAME_FILE', 'DELETE_FILE','EDIT_FILE');

DROP TABLE AccessLog;

CREATE TABLE AccessLog (
  id UUID DEFAULT gen_random_uuid(),
  consultant_id UUID,
  file_id UUID NOT NULL,
  ip VARCHAR(39) NOT NULL,
  type AccessType NOT NULL,
  timestap TIMESTAMP DEFAULT NOW(),
  CONSTRAINT AccessLog_PK PRIMARY KEY(id),
  CONSTRAINT AccessLog_Consultant FOREIGN KEY (consultant_id) REFERENCES Consultant(id),
  CONSTRAINT AccessLog_File FOREIGN KEY (file_id) REFERENCES File(id)
);



/**
  Trigger to create root folder when a client is created
 */
DROP TABLE File;


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

CREATE TRIGGER create_root_folder_trigger
  AFTER INSERT
  ON Client
  FOR EACH ROW
  EXECUTE PROCEDURE create_root_folder();


/**
  Function to create user or find user, and return it's UUID
 */

 CREATE OR REPLACE FUNCTION create_or_find_user(_email TEXT, _first_name TEXT, _last_name TEXT)
  RETURNS UUID
  LANGUAGE 'plpgsql'
  AS $BODY$
  DECLARE
    consultant_id UUID;
  BEGIN
    -- Check if user is found, and insert into consultant id
    SELECT C.id INTO consultant_id
    FROM Consultant AS C
    WHERE C.email = _email;
    -- Create a new consultant entry if not found
    IF NOT FOUND THEN
      -- generate a new ID for consultat
      consultant_id := gen_random_uuid();
      -- insert user
      INSERT INTO Consultant (id, email, first_name, last_name)
      VALUES (consultant_id, _email, _first_name, _last_name);
    END IF;
    -- return consultant ID
    RETURN consultant_id;
END;
$BODY$;

SELECT create_or_find_user('emilkalst@gmail.com','Emil','Kalstø');
SELECT * FROM Consultant;

/**
  Function to create new folder within an existing folder
 */
-- 8d527188-3cda-4d74-b1ec-a8f08b35822f


-- DROP FUNCTION create_folder(selected_folder UUID, in_new_name text);

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

SELECT * FROM filesandfolders;
-- View for combining files and folders into one table


CREATE OR REPLACE VIEW FilesAndFolders AS (
  SELECT id,client_id,parent_id,name,ref, type,last_changed, is_deleted, permanently_deleted, delete_date, is_directory,
      CASE
      WHEN parent_id IS NULL THEN TRUE
      ELSE FALSE
      END AS is_root
  FROM
      (SELECT id, client_id, parent_id, name, null AS ref, 'folder' AS type, last_changed,is_deleted, permanently_deleted, delete_date, true AS is_directory
      FROM Folder
      UNION
      SELECT File.id, Folder.client_id, File.folder_id, File.name, File.ref, File.type, File.last_changed, File.is_deleted, File.permanently_deleted, File.delete_date, false AS is_directory
      FROM File, Folder
      WHERE Folder.id = File.folder_id) AS U);


/**
  View for access log :)
 */

CREATE OR REPLACE VIEW AccessLogView AS (
   SELECT F.name AS file_name, F.id AS file_id, CO.first_name, CO.last_name, CO.id AS consultant_id, C.name AS client_name, C.id AS client_id, ip, AL.type, timestamp
    FROM AccessLog AS AL, File AS F, Folder AS FO, Client AS C, Consultant AS CO
    WHERE AL.file_id = F.id
      AND F.folder_id = FO.id
      AND FO.client_id = C.id
      AND CO.id = AL.consultant_id);

SELECT * FROM AccessLogView;

SELECT
    client_id,
    client_name,
    consultant_id,
    file_id,
    file_name,
    first_name,
    ip,
    last_name,
    timestamp,
    type
FROM AccessLogView
ORDER BY timestamp DESC
LIMIT 500;

SELECT * FROM Favourites;

-- 6dc3b05a-a7d5-4ea6-9259-9721a69a2d23
SELECT id,
       name,
       CASE WHEN
         F.client_id IS NULL THEN
         FALSE ELSE TRUE
         END AS is_favourite
FROM Client AS C
LEFT JOIN Favourites F on C.id = F.client_id
  AND F.user_id = 'c90716ea-7995-4ab2-b6f8-f01ad24eb87b'
WHERE is_deleted IS FALSE
ORDER BY name;


SELECT * FROM Consultant