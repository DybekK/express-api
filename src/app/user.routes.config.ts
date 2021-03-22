import { CommonRoutesConfig } from './common/common.routes.config';
import UserController from './controller/user.controller';
import UserMiddleware from './middleware/user.middleware';
import AuthMiddleware from './middleware/auth.middleware';
import {Application} from 'express';

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.route('/api/sign-in')
            .post(
                UserMiddleware.validateRequiredFields,
                UserController.postSignIn
            )

        this.app.route('/api/generate-key-pair')
            .post(
                AuthMiddleware.validateToken,
                UserController.getKeyPairs
            )

        this.app.route('/api/encrypt')
            .post(
                AuthMiddleware.validateToken,
                UserController.encryptPDF
            )
        return this.app;
    }
}