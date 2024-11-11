import multer from 'multer';

const storage = multer.diskStorage({
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage:multer.memoryStorage()});
export default upload;
