import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
import 'react-native-get-random-values';
import * as Keychain from 'react-native-keychain';

const PIN_HASH_KEYCHAIN_SERVICE = 'saad_task_pin_hash_v1';
const PIN_RANDOM_SALT_KEYCHAIN_SERVICE = 'saad_task_pin_salt_v1';

const generateSalt = (): string => {
  const randomBytes = new Uint8Array(16);
  const cryptoRef = globalThis as typeof globalThis & {
    crypto?: {getRandomValues: (array: Uint8Array) => Uint8Array};
  };
  if (!cryptoRef.crypto) {
    throw new Error('Secure random generator is unavailable');
  }
  cryptoRef.crypto.getRandomValues(randomBytes);
  return bytesToHex(randomBytes);
};

const derivePinHash = (pin: string, salt: string): string => {
  return bytesToHex(sha256(utf8ToBytes(`${salt}:${pin}`)));
};

const readKeychainSecret = async (service: string): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({service});
  if (!credentials) {
    return null;
  }

  return credentials.password;
};

export const savePin = async (pin: string): Promise<void> => {
  const salt = generateSalt();
  const hash = derivePinHash(pin, salt);

  await Keychain.setGenericPassword('pin-hash', hash, {
    service: PIN_HASH_KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  await Keychain.setGenericPassword('pin-salt', salt, {
    service: PIN_RANDOM_SALT_KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const isPinConfigured = async (): Promise<boolean> => {
  const [pinCredentials, saltCredentials] = await Promise.all([
    Keychain.getGenericPassword({service: PIN_HASH_KEYCHAIN_SERVICE}),
    Keychain.getGenericPassword({service: PIN_RANDOM_SALT_KEYCHAIN_SERVICE}),
  ]);
  return Boolean(pinCredentials && saltCredentials);
};

export const verifyPin = async (pin: string): Promise<boolean> => {
  const [credentials, salt] = await Promise.all([
    Keychain.getGenericPassword({service: PIN_HASH_KEYCHAIN_SERVICE}),
    readKeychainSecret(PIN_RANDOM_SALT_KEYCHAIN_SERVICE),
  ]);

  if (!credentials || !salt) {
    return false;
  }

  return credentials.password === derivePinHash(pin, salt);
};
