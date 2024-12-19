import * as crypto from 'crypto';

// Derivar una clave a partir de una contraseña usando PBKDF2
function deriveKey(password: string): Buffer {
  return crypto.pbkdf2Sync(password, process.env.SALT, 100000, 32, 'sha256');
}

// Función para encriptar el mensaje
export function encryptMessage(message: string): string {
  const iv = crypto.randomBytes(16);
  const key = deriveKey(process.env.ENCRYPTION_KEY);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Concatenar el IV al mensaje cifrado para poder usarlo en el descifrado
  return iv.toString('hex') + ':' + encrypted;
}

// Función para desencriptar el mensaje
export function decryptMessage(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex'); // Extraer el IV de la cadena cifrada
  const encryptedMessage = parts[1]; // El mensaje cifrado

  const key = deriveKey(process.env.ENCRYPTION_KEY); // Derivar la clave con PBKDF2

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
