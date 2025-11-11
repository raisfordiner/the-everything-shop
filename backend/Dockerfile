FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# COPY ./prisma .

EXPOSE $APP_PORT

CMD [ "sh", "-c", "npm run db:dev && npm run db:seed && npm run dev" ]
