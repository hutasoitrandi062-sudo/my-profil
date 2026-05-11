const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const messages = [];

app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Semua field harus diisi.' });
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  messages.unshift(newMessage);
  res.status(201).json({ message: 'Pesan tersimpan.', data: newMessage });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log('Buka halaman web melalui server untuk melihat Pesan Masuk.');
});
