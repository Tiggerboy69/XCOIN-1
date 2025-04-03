const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 1000;

// รองรับข้อมูล JSON (ถ้ามี body)
app.use(express.json());

// แสดงข้อความง่ายๆ เมื่อเปิดหน้าหลัก
app.get('/', (req, res) => {
  res.send('🚀 Webhook server is running!');
});

// รับข้อมูลจาก Make.com ผ่าน Query String
app.post('/webhook', (req, res) => {
  // ดึงค่าจาก query string
  const { user_id, coin, Status } = req.query;

  // สร้างข้อมูลที่จะบันทึก
  const dataToSave = {
    receivedAt: new Date().toISOString(),
    user_id,
    coin,
    Status
  };

  // โหลดข้อมูลเดิมจากไฟล์ (ถ้ามี)
  let currentData = [];
  if (fs.existsSync('data.json')) {
    currentData = JSON.parse(fs.readFileSync('data.json'));
  }

  // เพิ่มข้อมูลใหม่เข้าไป
  currentData.push(dataToSave);

  // บันทึกกลับลงไฟล์
  fs.writeFileSync('data.json', JSON.stringify(currentData, null, 2));

  console.log('✅ Data saved:', dataToSave);
  res.status(200).send('OK');
});

// แสดงข้อมูลทั้งหมด
app.get('/data', (req, res) => {
  if (!fs.existsSync('data.json')) {
    return res.status(200).send([]);
  }

  const data = JSON.parse(fs.readFileSync('data.json'));
  res.status(200).send(data);
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
