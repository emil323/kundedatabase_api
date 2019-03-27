/**
  Function to create user or find user, and return it's UUID
 */

 CREATE OR REPLACE FUNCTION create_or_find_user(_email TEXT, _first_name TEXT, _last_name TEXT, _is_admin BOOLEAN)
  RETURNS UUID
  LANGUAGE 'plpgsql'
  AS $BODY$
  DECLARE
    consultant_id UUID;
    cur_admin_status BOOLEAN;
    cur_first_name TEXT;
    cur_last_name TEXT;
  BEGIN
    -- Check if user is found, and insert into consultant id
    SELECT C.id, C.is_admin, C.first_name, C.last_name INTO consultant_id, cur_admin_status, cur_first_name, cur_last_name
    FROM Consultant AS C
    WHERE C.email = _email;
    -- Create a new consultant entry if not found
    IF NOT FOUND THEN
      -- generate a new ID for consultat
      consultant_id := gen_random_uuid();
      -- insert user
      INSERT INTO Consultant (id, email, first_name, last_name, is_admin)
      VALUES (consultant_id, _email, _first_name, _last_name, _is_admin);
    ELSE
      IF cur_admin_status != _is_admin OR _first_name != cur_first_name OR _last_name != cur_last_name THEN
        -- update user
        UPDATE Consultant
        SET is_admin=_is_admin, first_name=_first_name, last_name=_last_name
        WHERE id=consultant_id;
      END IF;
    END IF;
    -- return consultant ID
    RETURN consultant_id;
END;
$BODY$;