FROM node:8.6.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
ENV API_PORT 5000
ENV ELASTICSEARCH_HOST localhost
ENV ELASTICSEARCH_PORT 5000



EXPOSE $API_PORT

CMD node index.js
