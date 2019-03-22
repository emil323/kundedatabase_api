/**
  View for access log :)
 */

CREATE OR REPLACE VIEW AccessLogView AS (
SELECT F.name AS file_name, F.id AS file_id, F.parent_id, CO.first_name, CO.last_name, CO.id AS consultant_id, C.name AS client_name, C.id AS client_id, ip, AL.type, timestamp
FROM AccessLog AS AL, FilesAndFolders AS F, Consultant AS CO, Client AS C
WHERE AL.file_id = F.id
  AND CO.id = AL.consultant_id
  AND C.id = F.client_id);