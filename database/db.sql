
DROP DATABASE IF EXISTS kundedb;
CREATE DATABASE kundedb;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";



CREATE TABLE Consultant (
  id UUID DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  CONSTRAINT Consultant_PK PRIMARY KEY(id)
);

CREATE TABLE Client (
  id UUID DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  CONSTRAINT Client_PK PRIMARY KEY(id)
);

-- Emil, ta en titt på AccessLog?
CREATE TABLE AccessLog (
  id UUID DEFAULT gen_random_uuid(),
  email TEXT unique NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  last_changed TIMESTAMP DEFAULT NOW(),
  CONSTRAINT AccessLog_PK PRIMARY KEY(id)
)

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
  name VARCHAR(75) NOT NULL,
  last_changed TIMESTAMP DEFAULT NOW(),
  CONSTRAINT Folder_PK PRIMARY KEY (id),
  CONSTRAINT Folder_Client_FK FOREIGN KEY (client_id)
    REFERENCES Client(id),
  CONSTRAINT Folder_Folder_DK FOREIGN KEY (parent_id)
    REFERENCES Folder(id)
);

CREATE TABLE File (
  id UUID DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL,
  name VARCHAR(75) NOT NULL,
  ref VARCHAR(250),
  type TEXT NOT NULL,
  last_changed TIMESTAMP DEFAULT NOW(),
  CONSTRAINT File_UQ UNIQUE (folder_id,name),
  CONSTRAINT File_PK PRIMARY KEY (id),
  FOREIGN KEY (folder_id) REFERENCES Folder(id)
);
SELECT * FROM File;
INSERT INTO File(folder_id, name, ref, type) VALUES('2d88f3de-4432-4ed4-9816-2b170cee40f7', 'test','ref','pdf');
SELECT ref, type FROM File WHERE id = '';
DELETE FROM File;
/**
  Trigger to create root folder when a client is created
 */

CREATE OR REPLACE FUNCTION create_root_folder()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  AS $BODY$
  BEGIN
   INSERT INTO Folder(client_id, name)
   VALUES(NEW.id, '/');
 RETURN NEW;
END;
$BODY$;

CREATE TRIGGER create_root_folder_trigger
  AFTER INSERT
  ON Client
  FOR EACH ROW
  EXECUTE PROCEDURE create_root_folder();

-- AccessLog inserts
INSERT INTO AccessLog(first_name) VALUES("Jan");
INSERT INTO AccessLog(first_name) VALUES("Kriss");
INSERT INTO AccessLog(first_name) VALUES("Emil");

INSERT INTO Client(name) VALUES('Exodus');
INSERT INTO Client(name) VALUES('Anous');
INSERT INTO Client(name) VALUES('Cockfordollie');

SELECT C.name, F.id AS root_folder, c.id as client_id
FROM Folder AS F, Client AS C
WHERE C.id = F.client_id
AND parent_id IS NULL;

SELECT * FROM File;



SELECT id,client_id,parent_id,name,ref, type,last_changed, is_directory,
  CASE
    WHEN parent_id IS NULL THEN TRUE
    ELSE FALSE
  END AS is_root
FROM
  (SELECT id, client_id, parent_id, name, null AS ref, 'folder' AS type, last_changed, true AS is_directory
   FROM Folder
    UNION
  SELECT File.id, Folder.client_id, File.folder_id, File.name, File.ref, File.type, File.last_changed, false AS is_directory
  FROM File, Folder
  WHERE Folder.id = File.folder_id) AS U
WHERE client_id = '271cc5b7-b747-4e12-aae3-6f3b0eb77746'


