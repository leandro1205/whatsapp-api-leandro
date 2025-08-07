const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Inicia cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Evento: Geração do QR Code
client.on('qr', qr => {
    console.log('QR RECEBIDO', qr);
    qrcode.generate(qr, { small: true });
});

// Evento: Cliente pronto
client.on('ready', () => {
    console.log('✅ WhatsApp conectado com sucesso!');
});

// Evento: Mensagem recebida
client.on('message', async message => {
    console.log(`📩 Mensagem de ${message.from}: ${message.body}`);
    
    // Exemplo de resposta automática
    if (message.body.toLowerCase() === 'oi') {
        await message.reply('Olá! 👋 Seja bem-vindo(a)!');
    }
});

// Inicializa o cliente do WhatsApp
client.initialize();

// Rota básica para teste no Railway
app.get('/', (req, res) => {
    res.send('API do WhatsApp está rodando 🚀');
});

app.listen(port, () => {
    console.log(`Servidor web rodando na porta ${port}`);
});
