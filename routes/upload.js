const express = require('express');
const router = express.Router();
const ftp = require('basic-ftp');
const fs = require('fs');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    storage: multer.diskStorage({
        filename: function (_req, file, cb) {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, file.originalname);
        },
    }),
});


async function uploadFile(localFilePath, ftpFileName) {
    console.log('FTP 연결 시도');
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: Number(process.env.FTP_PORT),
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
        });
        await client.cd('/ESMS');
        await client.uploadFrom(localFilePath, ftpFileName);
        console.log('파일 업로드 성공', ftpFileName);
        fs.unlinkSync(localFilePath);
    } catch (err) {
        console.error('파일 업로드 중 오류 발생: ', err);
        throw err;
    } finally {
        client.close();
    }
}


router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ msg: '업로드된 파일이 없습니다.' });
    }
    try {
        await uploadFile(file.path, file.originalname);
        res.send({ msg: '업로드 성공' });
    } catch (error) {
        console.error('업로드 처리 중 오류 발생:', error);
        res.status(500).send({ msg: '업로드 실패.' });
    }
});

module.exports = router;