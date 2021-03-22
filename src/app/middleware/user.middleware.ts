import { Request, Response, NextFunction } from 'express';

class UserMiddleware {
    async validateRequiredFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({error: `missing required fields email and password`});
        }
    }
}

export default new UserMiddleware();