const express = require('express');
const router = express.Router();
const axios = require("axios");

router.post('/',  async (req, res) => {
    try {
        const url = `http://203.245.41.195:1214/api/login`;
        const response = await axios({
            method: req.method,
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
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});
module.exports = router;