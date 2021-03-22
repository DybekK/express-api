import {Request, Response} from 'express';
import userService from '../service/user.service';
import authService from '../service/auth.service';
import {AuthException} from "../exception/auth.exception";
import {AuthorizedRequest} from "../common/authorized.request";

class UserController {
    async postSignIn(req: Request, res: Response) {
        try {
            const authToken = await authService.generateJWT(req.body)
            res.status(200).send({authToken});
        } catch (error) {
            if(error instanceof AuthException) {
                res.status(401).send({error: `invalid email or password`});
            }
        }
    }

    async getKeyPairs(req: AuthorizedRequest, res: Response) {
        const keys = await userService.encryptUser(<string>req.user?.email);
        res.status(200).send({privKey: keys.privateKey, pubKey: keys.publicKey});
    }

    async encryptPDF(req: AuthorizedRequest, res: Response) {
        const code = await userService.encryptPDF(<string>req.user?.email);
        res.status(200).send(code);
    }
}

export default new UserController();