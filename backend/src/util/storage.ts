import "dotenv/config";
import fs from "fs";

const FILESERVER_URL = process.env.FILESERVER_URL;
const FILESERVER_AUTH = process.env.FILESERVER_AUTH;

if (!FILESERVER_URL || !FILESERVER_AUTH) {
  throw new Error("FILESERVER_URL and FILESERVER_AUTH must be set in .env");
}

const authHeader = `Basic ${Buffer.from(FILESERVER_AUTH).toString("base64")}`;

export async function uploadFile(localFilePath: string, remotePath: string): Promise<void> {
  const url = `${FILESERVER_URL}${remotePath}?j`;
  const fileBuffer = await fs.promises.readFile(localFilePath);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/octet-stream",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
}

export async function deleteFile(remotePath: string): Promise<void> {
  const url = `${FILESERVER_URL}${remotePath}?delete`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
  }
}
