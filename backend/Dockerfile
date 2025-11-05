FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $APP_PORT

CMD [ "sh", "-c", "npm run db:dev && npm start" ]
