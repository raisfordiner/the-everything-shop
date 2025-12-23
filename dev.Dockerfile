FROM node:22-bookworm

WORKDIR /workspaces/the-everything-shop

COPY . .

RUN npm install --prefix backend && npm install --prefix frontend

EXPOSE 8000 3000

CMD ["sleep", "infinity"]
