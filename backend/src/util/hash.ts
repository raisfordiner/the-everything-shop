import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, await bcrypt.genSalt());
}

export async function comparePassword(password: string, passwordHash: string) {
  return await bcrypt.compare(password, passwordHash);
}
