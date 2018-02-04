
FROM node:latest

EXPOSE 3001

RUN mkdir -p /usr/src/app

COPY package-lock.json /usr/src/app
COPY package.json /usr/src/app
COPY app.js /usr/src/app

WORKDIR /usr/src/app

RUN npm install 

CMD npm start