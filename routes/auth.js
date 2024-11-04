const express = require('express');
const router = express.Router();
const axios = require("axios");


// 권한 체크 (현재 로그인 중인가 : 페이지 처음 진입 시 필요)
router.get('/', async (req, res) => {
    const isValidSession = req.headers.cookie

    // if(isValidSession) return res.status(200).send({ isLoggedIn : true})
    // else return res.status(200).send({ isLoggedIn : false})
    if(isValidSession) return res.redirect('/login');
    else return res.redirect('/main/dashboard');
});

// 로그인
router.post('/', async (req, res) => {
    try {
        const url = `${process.env.BACKEND_URL}/login`;
        const response = await axios({
            method: 'POST',
            url: url,
            data: req.body,
            headers: {
                'Content-Type': req.headers['content-type'],
            },
            withCredentials: true,
        });

        const session_id = response.headers.authorization;
        res.cookie('session_id', session_id, {
            maxAge: 3600000, // 1시간
            httpOnly: true,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(error.response?.status).json({ error: error.message });
    }
});

// 로그아웃
router.delete('/', async (req, res) => {
    try {
        const url = `${process.env.BACKEND_URL}/logout`;
        const response = await axios({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': req.headers['content-type'],
            },
            withCredentials: true,
        });
        res.clearCookie('session_id');
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(error.response?.status).json({ error: error.message });
    }
});

module.exports = router;
