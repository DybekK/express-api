import { Request, Response, NextFunction } from 'express';
import {TokenExpiredError, verify} from "jsonwebtoken";
import {AuthorizedRequest} from "../common/authorized.request";
import {UserContext} from "../common/user.context";

class AuthMiddleware {
    async validateToken(req: Request|any, res: Response, next: NextFunction) {
        const bearerHeader = req.headers.authorization;
        const accessToken = bearerHeader && bearerHeader.split(' ')[1];

        try {
            const userContext = <UserContext>(verify(<string>accessToken, <string>process.env.SECRET));
            req.user = userContext;
            next();
        } catch (error) {
            res.status(401).send({error: error.message});
        }
    }
}

export default new AuthMiddleware();