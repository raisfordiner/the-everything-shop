import readline from "readline";
import { uploadFile, deleteFile } from "./util/storage";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testStorage() {
  try {
    const action = await question("Choose action (upload/delete): ");

    if (action.toLowerCase() === "upload") {
      const localFile = await question("Enter local file path: ");
      const remotePath = await question("Enter remote file location: ");
      await uploadFile(localFile, remotePath);
      console.log("Upload successful");
    } else if (action.toLowerCase() === "delete") {
      const remotePath = await question("Enter remote file path: ");
      await deleteFile(remotePath);
      console.log("Delete successful");
    } else {
      console.log("Invalid action. Please choose upload or delete.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

testStorage();
