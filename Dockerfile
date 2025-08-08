# Usa imagem Node enxuta com base Debian (bullseye)
FROM node:18-bullseye-slim

# Instala bibliotecas necessárias para o Chromium do Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json primeiro para aproveitar o cache de build
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --omit=dev

# Copia o restante do código para dentro do contêiner
COPY . .

# Exponha a porta 3000 (o app lê PORT via process.env.PORT)
EXPOSE 3000

# Comando de inicialização
CMD ["node", "index.js"]
