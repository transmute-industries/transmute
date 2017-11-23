# Transmute CLI

COPIED AT 77da4566934c75270be436a9fcb7717269513f2c

Work in progress CLI. 

Very alpha, expect breaking changes...

The Transmute CLI is a command line interface used for creating and deploying decentralized applications, patching existing applications with decentralized technologies, managing decentralized packages and libraries, and deploying and managing oracles. The CLI allows you to create a basic project where all the decentralized services are managed for you by Transmute as well as an advanced version where you have complete autonomy to implement or replace these services as you please.

# New Features!

  - Create a dApp from the CLI which is dockerized and contains a webserver, ipfs, firebase functions server, and an ethereum node (testrpc).
  - Advanced setup now creates a project which uses your local secrets stored at `~/.transmute`

### Tech

Transmute dApps uses a number of open source projects to work properly:

* [Node] - evented I/O for the backend
* [Yarn] - fast, reliable, and secure dependency management.
* [TestRPC] - fast Ethereum RPC client for testing and development
* [IPFS] - the Permanent Web 
* [Gulp] - the streaming build system
* [Semantic] - UI component framework based around useful principles from natural language.
* [Truffle] - the most popular Ethereum development framework

And of course all Transmute code itself is open source with a [public repository](https://github.com/transmute-industries) on GitHub.

### Dependency Installation

Install [Docker](https://www.docker.com/) to run the containerized dApps created by the CLI.
Transmute CLI requires [Node.js](https://nodejs.org/) v8.6+ to run.

Install the CLI as well as some global dependencies for local Ethereum development with the Transmute boilerplate.

```sh
$ npm install -g transmute-cli@latest yarn ethereumjs-testrpc truffle@beta
```

Optional install for running processes in background [pm2](https://github.com/Unitech/pm2)
```sh
$ npm install -g pm2
```

## Local Environment Setup

The Transmute CLI uses `~/.transmute` directory for managing secrets for cloud functions that provide oracle services to your smart contracts. For ease of use, follow these steps to get the most our of your dApp development process - otherwise you will need to remove the `functions` service from the `docker-compose.yml` which is created for you after creating your first project with this tool.

If you are brand new, you will need to setup some files, after running:
```sh
$ transmute setup
```

If you have configs stored somewhere, you can use them like this:
```sh
$ transmute setup --from $PATH_TO_YOUR_DIRECTORY
```

### Firebase Setup

At present, our boilerplate leverages Firebase cloud functions for Oracle services. We are working to integrate other cloud providers as well as working on a decentralized Oracle service but the most important thing is that we get you up and running first.

If you haven't already, sign up for [Firebase](https://console.firebase.google.com)

After signing up / signing in, do the following:
- Create a new project
- Click **'Add Firebase to your web app'**
- Copy the value of the config var and save it to `~/.transmute/firebase-client-config.json`
- Go to Develop, Database and click **'Try Firestore Beta'** in locked mode
- Click the gear next to your project name and click **'Users and Permissions'** - this should take you to the IAM tab in the Google Cloud Console
- Click **'Service Accounts'** in the side menu
- Click **'Create Service Account'** with whatever name and Project > Owner
- Furnish a new JSON key and click **'Create'**
- Save that file in a secure place and copy the contents into `~/.transmute/firebase-service-account.json`
- Go to the [Google Cloud Console](https://console.cloud.google.com) and select your project from the menu in the upper left-hand corner
- Click **'APIs & services'** in the side menu
- Search for and enable **'Google Cloud Firestore API'**

Lastly, ensure that you update `~/.transmute/environment.secret.env` to look like the following:
```
GOOGLE_PROJECT_NAME="$YOUR_PROJECT_NAME"
WEB3_PROVIDER_URL="http://testrpc:8545"
TRANSMUTE_API_ROOT="http://functions:3001"
```

## Creating a dApp

### Basic (Coming soon)
[//]: # (This may be the most platform independent comment)
[//]: # (Just a front end app, using transmute hosted services (this repo)
[//]: # (```sh $ transmute init --basic . ```
This will create a new dapp, which is configured to use transmute industries hosted functions, ethereum and ipfs. This app provides a pure front end development experience for users who do not wish to configure functions, ethereum or ipfs, but who do wish to develop against hosted version of these services.)
### Advanced

Dockerized app, api, ipfs and ethereum, fully configurable boilerplate.
```sh
$ transmute init --advanced 
$ cd dapp
$ yarn install
$ cd semantic
$ gulp build
$ cd ..
$ docker-compose up --build
```
This will create a new dapp, which contains these functions, as well as docker configurations for ethereum, ipfs and a demo web app. This boilerplate is meant to be a starting point for developers, not all of these services may be desired.

### Dev Commands 
``` 
$ npm install 
$ firebase init 
$ yarn transmute install globals 
$ yarn transmute login
$ yarn transmute echo 'hello' 

$ yarn transmute serve 
$ yarn transmute firestore 
$ yarn transmute accounts 
$ yarn transmute sign -m "100:0x6e13dbe820cdf54f79bde558ab1a6b6ff2261b42" 
$ yarn transmute sign -m "sign:0x6187a9e0fc30a546e7243c600518c098773f2f846a87c81a4831ffd03a9bd941"

$ yarn transmute recover -m <msg> -s <sig> 
$ yarn transmute patch
$ yarn transmute unpatch
``` 

## Environment Commands

### JavaScript 
```
$ yarn transmute gen-node js dapp ../secrets/environment.secret.env ./environment.node.js
$ yarn transmute gen-web js ./environment.web.js
```

### Misc
```
$ yarn transmute gen-mask ./environment.secret.env ./environment.example.env 
$ yarn transmute mig-env firebase transmute ./environment.secret.env 
```


### TestRPC with ngrok

```yml
authtoken: TOKEN
tunnels:
  functions:
    addr: 3001
    proto: http
    hostname: functions.transmute.industries

  testrpc:
    addr: 8545
    proto: http
    hostname: testrpc.transmute.industries
```

```sh
$ ngrok start testrpc functions
```

#### Reading 
 
- https://firebase.google.com/docs/functions/config-env 
- https://www.npmjs.com/package/dotenv

### Todos

 - Improve advanced dapp setup
 - Document docker-less environment setup
 - Provide example smart contracts extending basic setup
 - Provide example oracles leveraging JWTs issued through signing challenges

License
---------------
MIT

