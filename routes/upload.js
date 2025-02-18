const express = require('express');
const router = express.Router();
// const ftp = require('basic-ftp');
// const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 },
    storage: multer.diskStorage({
        filename: function (_req, file, cb) {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, file.originalname);
        },
    }),
});


async function uploadFileProduction(localFilePath, sftpFileName) {
    console.log('운영 환경 SFTP 연결 시도');
    const client = new SftpClient();
    try {
        await client.connect({
            host: process.env.SFTP_HOST,
            port: Number(process.env.SFTP_PORT),
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD
        });
        console.log('SFTP 연결 성공');
        // await client.cwd(`/uploads/${sftpFileName}`);
        // await client.put(localFilePath, sftpFileName);
        await client.put(localFilePath, `/uploads/${sftpFileName}`);

        console.log('파일 업로드 성공', sftpFileName);
        fs.unlinkSync(localFilePath);
    } catch (err) {
        console.error('파일 업로드 중 오류 발생: ', err);
        throw err;
    } finally {
        await client.end();
    }
}

async function uploadFileDevelop(localFilePath, sftpFileName) {
    console.log('개발 환경 파일 저장 시작');
    try {
        console.log('파일 저장 시작');

        const uploadDir = path.join(__dirname, 'files');

        console.log('경로', uploadDir)

        // 디렉토리가 없으면 생성
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 파일을 해당 디렉토리로 이동
        const destinationPath = path.join(uploadDir, sftpFileName);
        fs.renameSync(localFilePath, destinationPath);

        console.log('파일 저장 성공:', destinationPath);
        return destinationPath;
    } catch (err) {
        console.error('파일 업로드 중 오류 발생: ', err);
        throw err;
    }
}


router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ msg: '업로드된 파일이 없습니다.' });
    }
    try {

        // 개발 환경
        if (process.env.NODE_ENV === 'development') await uploadFileDevelop(file.path, file.originalname);

        // 운영 환경
        else await uploadFileProduction(file.path, file.originalname);

        res.send({ msg: '업로드 성공' });
    } catch (error) {
        console.error('업로드 처리 중 오류 발생:', error);
        res.status(500).send({ msg: '업로드 실패.' });
    }
});

module.exports = router;