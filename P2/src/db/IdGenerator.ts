import { randomBytes } from 'crypto';

export function generateRandomId() {
  const randomID = randomBytes(10).toString('hex');
  return randomID;
}
