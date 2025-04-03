const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 1000;

app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const data = req.body;
  let savedData = [];

  // อ่านข้อมูลเก่า (ถ้ามี)
  if (fs.existsSync('data.json')) {
    savedData = JSON.parse(fs.readFileSync('data.json'));
  }

  // เพิ่มข้อมูลใหม่
  savedData.push({
    receivedAt: new Date().toISOString(),
    ...data
  });

  // เขียนกลับลงไฟล์
  fs.writeFileSync('data.json', JSON.stringify(savedData, null, 2));

  res.status(200).send({ status: 'ok', message: 'Data received.' });
});

// Endpoint เพื่อดึงข้อมูลที่เคยบันทึก
app.get('/data', (req, res) => {
  if (!fs.existsSync('data.json')) {
    return res.status(200).send([]);
  }

  const data = JSON.parse(fs.readFileSync('data.json'));
  res.status(200).send(data);
});

app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
