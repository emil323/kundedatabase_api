
DROP DATABASE IF EXISTS kundedb;
CREATE DATABASE kundedb;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext"; -- this module is for non case insensitive text


CREATE TYPE AccessType AS ENUM ('VIEW_FILE', 'RENAME_FILE', 'DELETE_FILE','EDIT_FILE');


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
