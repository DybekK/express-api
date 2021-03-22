import {Request} from "express";
import {UserContext} from "./user.context";

export interface AuthorizedRequest extends Request {
    user?: UserContext
}