FROM node:26-alpine
WORKDIR /app
COPY M4-backend/package*.json ./
RUN npm ci
COPY M4-backend/ ./

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]

