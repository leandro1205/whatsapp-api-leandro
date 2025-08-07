const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: process.env.SESSION_NAME || 'leandro_bot' }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--disable-dev-shm-usage']
  }
});

let qrCodeData = null;

client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (!err) qrCodeData = url;
  });
  console.log('QR Code gerado. Acesse /qr para visualizar.');
});

client.on('ready', () => {
  console.log('✅ WhatsApp conectado e pronto para uso!');
});

client.initialize();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API WhatsApp está rodando 🚀' });
});

app.get('/qr', (req, res) => {
  if (qrCodeData) {
    res.send(`<img src="${qrCodeData}" />`);
  } else {
    res.send('QR code ainda não gerado ou já autenticado.');
  }
});

app.post('/send', async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message) {
    return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' });
  }
  try {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem.', details: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
