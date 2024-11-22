FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["sh", "-c", "npm run seed:drivers && node dist/index.js"]
EXPOSE 8080
