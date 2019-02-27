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