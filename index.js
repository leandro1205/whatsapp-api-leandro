const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize WhatsApp client with persistent local auth
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

client.on('qr', (qr) => {
    // Generate and display QR code in console
    qrcode.generate(qr, { small: true });
    console.log('QR code received, scan the code above with your WhatsApp app');
});

client.on('ready', () => {
    console.log('WhatsApp client is ready to use');
});

client.on('auth_failure', (message) => {
    console.error('Authentication failure', message);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.initialize();

// API endpoint to send a WhatsApp message
app.post('/send', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Missing number or message in request body' });
    }

    try {
        // WhatsApp numbers need to include the country code without + sign
        const chatId = number.includes('@c.us') ? number : number + '@c.us';
        await client.sendMessage(chatId, message);
        console.log('Sent message to ' + chatId + ': ' + message);
        return res.json({ success: true });
    } catch (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ error: 'Failed to send message' });
    }
});

app.get('/', (req, res) => {
    res.send('WhatsApp API server is running');
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});
