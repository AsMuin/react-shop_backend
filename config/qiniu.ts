import qiniu from 'qiniu';
const mac = new qiniu.auth.digest.Mac(process.env.QINIU_ACCESS_KEY, process.env.QINIU_SECRET_KEY);
const options = {
    scope: process.env.QINIU_BUCKET_NAME
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();
// 空间对应的区域，若不配置将自动查询
config.regionsProvider = qiniu.httpc.Region.fromRegionId('as0');

//通过本地文件路径上传文件到七牛云
export const uploader = async (filePath: string, fileName: string) => {
    try {
        const {data, resp} = await new qiniu.form_up.FormUploader(config).putFile(
            uploadToken,
            process.env.QINIU_PATH + fileName,
            filePath,
            new qiniu.form_up.PutExtra()
        );
        if (resp.statusCode === 200) {
        } else {
            console.error(resp.statusCode);
        }
        return process.env.QINIU_URL + data.key;
    } catch (error) {
        console.error(error);
    }
};

// uploader('C:/Users/AsMuin/Pictures/233.jpg', '这是超级测试数据.jpg').then(res => console.log(res));
