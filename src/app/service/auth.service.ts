import jwt from "jsonwebtoken";
import {UserDto} from "../dto/user.dto";
import {users} from "../../database/database";
import {AuthException} from "../exception/auth.exception";

class AuthService {
    async generateJWT(userDto: UserDto): Promise<string> {
        const user = users.find((user) => user.email === userDto.email && user.password === userDto.password);
        if (!user) {
            throw new AuthException();
        }
        const expiresIn = Number(process.env.EXPIRATION_TOKEN_TIME);
        return jwt.sign({email: user.email}, <string>process.env.SECRET, {expiresIn});
    };
}


export default new AuthService();