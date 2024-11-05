import jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';
function adminAuth(request: Request, response: Response, next: NextFunction): void {
    try {
        console.log(request.headers);
        const {authorization} = request.headers;
        if (!authorization) {
            response.json({success: false, message: '缺少用户凭证'});
            return;
        }
        const token_decode = jwt.verify(authorization as string, process.env.JWT_SECRET as string);
        if (token_decode !== process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!) {
            response.json({success: false, message: '用户凭证错误'});
            return;
        }
        next();
    } catch (error: any) {
        response.json({success: false, message: error.message});
        return;
    }
}

export default adminAuth;
