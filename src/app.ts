import express, {Application} from 'express';
import * as bodyparser from 'body-parser';
import cors from 'cors'
import {CommonRoutesConfig} from './app/common/common.routes.config';
import {UserRoutes} from './app/user.routes.config';
import {config} from 'dotenv';

config();
export const app: Application = express();
const routes: Array<CommonRoutesConfig> = [];

app.use(bodyparser.json());
app.use(cors());

routes.push(new UserRoutes(app));