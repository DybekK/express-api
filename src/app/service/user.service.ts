import {generateKeyPairSync, KeyPairSyncResult} from "crypto";
import axios from "axios";
import Base64 from "crypto-js/enc-base64";
import hmacSHA512 from "crypto-js/hmac-sha512";

class UserService {
    async encryptUser(email: string): Promise<KeyPairSyncResult<string, string>> {
        return generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: email
            }
        });
    }

    async encryptPDF(email: string): Promise<string> {
        const {data} = await axios.get('http://www.africau.edu/images/default/sample.pdf');
        const {publicKey} = await this.encryptUser(email);
        return Base64.stringify(hmacSHA512(data, publicKey));
    }
}

export default new UserService();