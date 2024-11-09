import type {controllerAction} from '.';
import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
function createToken(id: string) {
    return jwt.sign({id}, process.env.JWT_SECRET!);
}
//User Login
const loginUser: controllerAction = async (request, response) => {
    try {
        const {email, password} = request.body;
        //用户是否存在？密码是否正确？
        const user = await User.findOne({email});
        if (!user) {
            return response.json({success: false, message: '用户不存在'});
        }
        const isVerified = await bcrypt.compare(password, user.password);
        if (!isVerified) {
            return response.json({success: false, message: '密码错误'});
        }
        const token = createToken(user._id.toString());
        response.json({success: true, message: '登录成功', token});
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};
//User Register
const registerUser: controllerAction = async (request, response) => {
    try {
        const {name, email, password}: RegisterRequest = request.body;
        //用户是否存在？注册信息是否有效？
        const exists = await User.findOne({email});
        if (exists) {
            return response.json({success: false, message: '用户已存在'});
        }
        if (!validator.isEmail(email)) {
            return response.json({success: false, message: '邮箱格式不正确'});
        }
        if (password.length < 9) {
            return response.json({success: false, message: '密码长度至少9位'});
        }
        //密码脱敏
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();
        // const token = createToken(user._id.toString() );
        response.json({success: true, message: '注册成功'});
    } catch (error: any) {
        console.log(error);
        response.json({success: false, message: error.message});
    }
};
//Admin Login
const adminLogin: controllerAction = async (request, response) => {
    try {
        const {email, password} = request.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET!);
            response.json({success: true, message: '管理员登录成功', token});
        } else {
            response.json({success: false, message: '错误的账号或密码'});
        }
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};
export {loginUser, registerUser, adminLogin};
