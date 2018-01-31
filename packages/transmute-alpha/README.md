# Transmute Alpha

## Dependencies
- [Latest Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

Install lerna with `npm i lerna -g`.

Next, you will need to start IPFS and testrpc locally. From inside `./packages/`, run:

```
docker-compose up
```

Next, you will use the CLI to create smart contracts and publish packages using IPFS and firebase. 

This demo requires you to regsiter an email and password, in order to demonstrate how the transmute framework can be used to integrate with existing backends.

```
npm run prep
```

This command compiles and deploys ethereum smart contracts, generates typescript classes from them, and builds the transmute framework. 

```
npm run transmute-alpha
```

This command starts the CLI, which is used to manage etherum smart contracts and interface with firebase.


```
tour
```

Running this command from inside the CLI will start the demo tour.





