import * as crypto from 'crypto';

export function encryptMessage(message: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8');
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf-8');

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptMessage(encrypted: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8');
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf-8');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
