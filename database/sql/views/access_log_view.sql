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