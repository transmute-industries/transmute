
FROM node:latest

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g yarn truffle@beta

RUN yarn install 

EXPOSE 3000

CMD RPC_HOST=testrpc truffle migrate && yarn move-contracts && yarn start
