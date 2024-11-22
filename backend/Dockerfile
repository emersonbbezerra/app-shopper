FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

COPY start.sh .

RUN chmod +x start.sh

CMD ["./start.sh"]