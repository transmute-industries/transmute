### Create React App

Build a Firestore Create React App with Transmute Framework and CLI from scratch instructions.

### Setup

Setup Manually:

```
transmute setup
```

Setup from Clone _recommended_.

```
transmute setup --from ~/Code/secrets/.transmute/
```

### ngrok

In order to test many api integrations, you will need to use ngrok to expose your local functions to the internet.

Example config:

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

Start ngrok.

```sh
ngrok start testrpc functions
```

Alternatively, edit your environment.secret.env to use localhost, and avoid anything requiring internet callbacks.

See rebuild.sh

