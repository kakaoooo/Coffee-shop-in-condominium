require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/api');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Global Fallback Error:', err);
  res.status(500).json({ error: 'เซิร์ฟเวอร์หลังบ้านขัดข้อง: ' + err.message });
});

// 👈 ดึง PORT จาก .env ถ้าไม่มีให้ใช้ 5001
const PORT = process.env.PORT || 5001; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});