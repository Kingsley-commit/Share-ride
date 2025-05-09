import CryptoJS from "crypto-js";
import { config } from "../../core/config/env.js";

const encryptorKey = config.auth.encryptoSecretKey;

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, encryptorKey).toString();
};

const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, encryptorKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const generateVerificationToken = () => {
  const randomBytes = CryptoJS.lib.WordArray.random(32);

  return CryptoJS.enc.Base64.stringify(randomBytes);
};

export { encrypt, decrypt, generateVerificationToken };
