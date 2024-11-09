import jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';
function userAuth(request: Request, response: Response, next: NextFunction): void {
    const {authorization} = request.headers;
    if (!authorization) {
        response.json({success: false, message: '账号，密码不正确'});
        return;
    }
    try {
        const token_decode: any = jwt.verify(authorization, process.env.JWT_SECRET as string);
        request.body.userId = token_decode.id;
        next();
    } catch (error: any) {
        console.log(error);
        response.json({success: false, message: error.message});
        return;
    }
}
export default userAuth;
