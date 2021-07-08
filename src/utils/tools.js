import CryptoJS from "crypto-js";
import { SecretKey } from "./config";

export default {
  encrypt(password) {
    return CryptoJS.AES.encrypt(password, SecretKey).toString();
  },
  decrypt(ciphertext) {
    let bytes = CryptoJS.AES.decrypt(ciphertext, SecretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};
