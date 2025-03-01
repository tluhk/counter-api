FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# The port can be overridden at runtime
ENV PORT=3000

EXPOSE $PORT

CMD ["sh", "-c", "node src/index.js"]
