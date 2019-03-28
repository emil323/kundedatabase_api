CREATE OR REPLACE VIEW FilesAndFolders AS (
  SELECT id,client_id,parent_id,name,ref, type,last_changed, size,is_deleted, permanently_deleted, delete_date, is_directory,
      CASE
      WHEN parent_id IS NULL THEN TRUE
      ELSE FALSE
      END AS is_root
  FROM
      (SELECT id, client_id, parent_id, name, null AS ref, 'folder' AS type, last_changed, 0 as size,is_deleted, permanently_deleted, delete_date, true AS is_directory
      FROM Folder
      UNION
      SELECT File.id, Folder.client_id, File.folder_id, File.name, File.ref, File.type, File.last_changed, File.size, File.is_deleted, File.permanently_deleted, File.delete_date, false AS is_directory
      FROM File, Folder
      WHERE Folder.id = File.folder_id) AS U);