import express from 'express';
import {
    loginUser,
    registerUser,
    adminLogin,
    userUpdatePassword,
    userUploadAvatar,
    userProfile,
    userUpdateName,
    userUpdateEmail
} from '../controllers/userController';
import userAuth from '../middleware/auth';
import upload from '../middleware/multer';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/info', userAuth, userProfile);
userRouter.post('/updatePassword', userAuth, userUpdatePassword);
userRouter.post('/uploadAvatar', upload.single('avatar'), userAuth, userUploadAvatar);
userRouter.post('/updateName', userAuth, userUpdateName);
userRouter.post('/updateEmail', userAuth, userUpdateEmail);
export default userRouter;
