import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import ecc from 'eosjs-ecc/lib';
import ecies from 'standard-ecies';

const iv = CryptoJS.MD5('bUM6Ctxyu5ALnPFJ');

export default class CryptoAES {
    static encrypt(word,password) {
        const key = CryptoJS.enc.Hex.parse(password);
        const srcs = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.AES.encrypt(srcs, key, { 
            iv: iv, 
            mode: CryptoJS.mode.CBC, 
            padding: CryptoJS.pad.Pkcs7 
        });
        return encrypted.ciphertext.toString().toUpperCase();
    }
    static decrypt(word,password) {
        try {
            const key = CryptoJS.enc.Hex.parse(password);
            const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
            const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            const decrypt = CryptoJS.AES.decrypt(srcs, key, { 
                iv: iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7 
            });
            const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString();
        } catch (error) {
            return ''
        }
    }

    
    static encryptMsg( publicKey, message ) {        
        const pubBuffer = ecc.PublicKey(publicKey, "POG").toUncompressed().toBuffer();
        //   assert(pubBuffer.length == 65);
        if (pubBuffer.length !== 65) {
            return '';
        }

        const messageBuffer = (typeof message == "string" ? Buffer.from(message) : message);
        const encryptedBuffer = ecies.encrypt(pubBuffer, messageBuffer);

        return encryptedBuffer.toString('hex');
    }

    static decryptMsg( privateKey, encrypt ) {
        const ecdh = crypto.createECDH('secp256k1');
        const privBuffer = ecc.PrivateKey(privateKey).toBuffer();
        //   assert(privBuffer.length == 32);
        if (privBuffer.length !== 32) {
            return "";
        }
        ecdh.setPrivateKey(privBuffer);

        const encryptBuffer  = typeof encrypt == 'string' ? Buffer.from(encrypt, "hex") : encrypt;
        return ecies.decrypt(ecdh, encryptBuffer).toString();
    }

}
