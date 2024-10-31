const axios = require("axios");
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

dotenv.config();

const app = express();
const PORT = 8080;

// CORS 설정
const corsOptions = {
  origin: ['http://localhost:5173', 'http://210.114.22.35/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
