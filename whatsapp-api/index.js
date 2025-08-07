const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let qrImageData = null;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: process.env.SESSION_NAME || 'leandro_bot' }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }
});

client.on('qr', async (qr) => {
  try {
    qrImageData = await qrcode.toDataURL(qr);
    console.log('QR gerado. Acesse /qr para escanear.');
  } catch (e) {
    console.error('Erro ao gerar QR:', e.message);
  }
});

client.on('ready', () => {
  console.log('✅ WhatsApp conectado e pronto!');
  // limpa o QR após conectar
  qrImageData = null;
});

client.on('message', async (message) => {
  console.log(`📩 ${message.from}: ${message.body}`);

  if (message.body?.toLowerCase() === 'oi') {
    await message.reply('Olá! 👋 Seja bem-vindo(a)!');
  }
});

client.initialize();

// ---- Rotas HTTP ----
app.get('/', (_req, res) => res.json({ ok: true, up: true }));

app.get('/qr', (_req, res) => {
  if (!qrImageData) return res.status(200).send('QR ainda não gerado ou já conectado. Recarregue em alguns segundos.');
  res.status(200).send(`<html><body style="display:grid;place-items:center;height:100vh;background:#111;color:#eee">
    <h2>Escaneie o QR Code no WhatsApp</h2>
    <img src="${qrImageData}" style="width:320px;height:320px;border-radius:8px;border:1px solid #333"/>
  </body></html>`);
});

app.post('/send', async (req, res) => {
  try {
    const { number, message, token } = req.body;
    if (token !== process.env.AUTH_TOKEN) return res.status(401).json({ error: 'Invalid token' });
    if (!number || !message) return res.status(400).json({ error: 'number e message são obrigatórios' });

    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

app.listen(PORT, () => console.log(`🚀 HTTP pronto na porta ${PORT}`));
