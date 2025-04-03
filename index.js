const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ GET /
app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

// ✅ POST /webhook — รับข้อมูลแล้วบันทึกลงไฟล์
app.post('/webhook', (req, res) => {
  const newData = req.body;
  let currentData = [];

  if (fs.existsSync('data.json')) {
    currentData = JSON.parse(fs.readFileSync('data.json'));
  }

  currentData.push({
    receivedAt: new Date().toISOString(),
    ...newData
  });

  fs.writeFileSync('data.json', JSON.stringify(currentData, null, 2));
  console.log('Webhook received and saved:', newData);

  res.status(200).send('OK');
});

// ✅ GET /data — ดึงข้อมูลทั้งหมดที่เคยบันทึก
app.get('/data', (req, res) => {
  if (!fs.existsSync('data.json')) {
    return res.status(200).send([]);
  }

  const data = JSON.parse(fs.readFileSync('data.json'));
  res.status(200).send(data);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
