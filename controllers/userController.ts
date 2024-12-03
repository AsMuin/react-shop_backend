import type { controllerAction } from '.';
import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import CF_upload from '../config/cloudFlare';
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
function createToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
}
//User Login
const loginUser: controllerAction = async (request, response) => {
    try {
        const { email, password } = request.body;
        //用户是否存在？密码是否正确？
        const user = await User.findOne({ email });
        if (!user) {
            return response.json({ success: false, message: '用户不存在' });
        }
        const isVerified = await bcrypt.compare(password, user.password);
        if (!isVerified) {
            return response.json({ success: false, message: '密码错误' });
        }
        const token = createToken(user._id.toString());
        response.json({
            success: true,
            message: '登录成功',
            token,
            data: { name: user.name, email: user.email, avatar: user.avatar ?? '' }
        });
    } catch (error: any) {
        response.json({ success: false, message: error.message });
    }
};
//User Register
const registerUser: controllerAction = async (request, response) => {
    try {
        const { name, email, password }: RegisterRequest = request.body;
        //用户是否存在？注册信息是否有效？
        const exists = await User.findOne({ email });
        if (exists) {
            return response.json({ success: false, message: '用户已存在' });
        }
        if (!validator.isEmail(email)) {
            return response.json({ success: false, message: '邮箱格式不正确' });
        }
        if (password.length < 9) {
            return response.json({ success: false, message: '密码长度至少9位' });
        }
        //密码脱敏
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, avatar: '' });
        await newUser.save();
        // const token = createToken(user._id.toString() );
        response.json({ success: true, message: '注册成功' });
    } catch (error: any) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

//User Profile
const userProfile: controllerAction = async (request, response) => {
    try {
        const { userId } = request.body;
        const user = await User.findById(userId);
        if (!user) {
            return response.json({ success: false, message: '用户不存在' });
        }
        response.json({
            success: true,
            message: '获取用户信息成功',
            data: { name: user.name, email: user.email, avatar: user.avatar ?? '' }
        });
    } catch (error: any) {
        response.json({ success: false, message: error.message });
    }
};
//User UpdatePassword
const userUpdatePassword: controllerAction = async (request, response) => {
    try {
        const { userId, originalPassword, password, confirmPassword } = request.body;
        console.log(userId, originalPassword, password, confirmPassword);
        const user = await User.findById(userId);
        if (!user) {
            return response.json({ success: false, message: '用户不存在' });
        }
        if (password !== confirmPassword) {
            return response.json({ success: false, message: '两次密码输入不一致' });
        }
        const isVerified = await bcrypt.compare(originalPassword, user.password);
        if (!isVerified) {
            return response.json({ success: false, message: '原密码错误' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return response.json({ success: true, message: '密码修改成功' });
    } catch (error: any) {
        console.log(error);
        response.json({ success: true, message: error.message });
    }
};
//User UploadAvatar
const userUploadAvatar: controllerAction = async (request, response) => {
    try {
        const { userId } = request.body;
        const avatar = request.file;
        const user = await User.findById(userId);
        if (!user) {
            return response.json({ success: false, message: '用户不存在' });
        }
        const avatarUrl = await CF_upload(avatar!.buffer, avatar!.originalname);
        user.avatar = avatarUrl;
        await user.save();
        response.json({ 
            success: true,
            message: '头像上传成功', 
            data:  { name:  user.name,  avatar: user.avatar,  email: user.email } 
        });
    } catch (error: any) {
        response.json({ success: false, message: error.message });
    }
};
//User UpdateProfile
const userUpdateName: controllerAction = async(request,response)=>{
    try{
        const {userId, name } = request.body;
        const user = await User.findById(userId);
        if(!user){
            return response.json({success: false, message: '用户不存在'});
        }else{
            user.name = name;
            await user.save();
            response.json({success: true, message: '用户名修改成功',data: {name: name,avatar: user.avatar,email: user.email}});
        }
    }  catch  (error:  any)  {
        response.json({ success: false, message: error.message });
    }
};

const userUpdateEmail: controllerAction = async (request, response) => {
    try {
        const { userId, email } = request.body;
        const user = await User.findById(userId);
        if (!user) {
            return response.json({ success: false, message: '用户不存在' });
        } else {
            user.email = email;
            await user.save();
            response.json({ success: true, message: '邮箱修改成功', data: { name: user.name, avatar: user.avatar, email: user.email } });
        }
    } catch (error: any) {
        response.json({ success: false, message: error.message })
    }
};
//Admin Login
const adminLogin: controllerAction = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET!);
            response.json({ success: true, message: '管理员登录成功', token });
        } else {
            response.json({ success: false, message: '错误的账号或密码' });
        }
    } catch (error: any) {
        response.json({ success: false, message: error.message });
    }
};
export { loginUser, registerUser, adminLogin, userUpdatePassword, userUploadAvatar, userProfile, userUpdateEmail, userUpdateName };
