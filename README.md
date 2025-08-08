# WhatsApp API

This project provides a minimal Express server that uses the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/) library to send WhatsApp messages via an HTTP API. It runs a headless Chromium instance and uses your existing WhatsApp account to send messages.

## Features

- REST endpoint to send a WhatsApp message to a given number.
- Uses persistent local authentication (no need to scan the QR code every time).
- Displays a QR code in the terminal on first run for you to link your WhatsApp account.
- Simple Express server with JSON request/response.

## Prerequisites

- [Node.js](https://nodejs.org/) 14 or higher.
- A WhatsApp account that can be linked to a web session.

## Installation

Clone this repository and install the dependencies:

    npm install

## Running

Start the server with:

    node index.js

On first run, a QR code will be printed to the terminal. Open WhatsApp on your phone, go to **Settings → Linked devices → Link a device**, and scan the QR code. Once linked, the server will store your session locally and you won't need to scan again.

The server listens on port 3000 by default (override with the `PORT` environment variable). You can test it with a `curl` command or any HTTP client:

    curl -X POST http://localhost:3000/send \
      -H "Content-Type: application/json" \
      -d '{"number": "5511999999999", "message": "Olá, isso é uma mensagem enviada pela API!"}'

Replace `5511999999999` with the recipient's full phone number (country code + area code + number) without the plus sign.

## Notes

- The server uses persistent local authentication stored in the `.wwebjs_auth` folder. Do not commit this folder to version control.
- If authentication fails or you want to relink your account, delete the `.wwebjs_auth` directory and restart the server.
- This project is intended for personal/educational use. Be mindful of WhatsApp's terms of service when automating messages.
