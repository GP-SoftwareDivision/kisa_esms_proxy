FROM node:18-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "server"]
