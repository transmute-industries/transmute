# Transmute Local Development

This tutorial covers setting up a local development environment.

### minikube

Follow these instructions to setup minikube:

- [Setting up Minikube](../minikube/README.md)

### kong

Follow these instructions to setup minikube:

- [Setting up Kong](../minikube/kong/README.md)

It may take a while for kong to wake up, you will see:

```
Waiting, endpoint for service is not ready yet...
```

Be patient, eventually these will succeed:

```
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
```

### ngrok

#### Config

Setup your ngrok configuration file:

* https://ngrok.com/docs#config-location

```
authtoken: TOKEN
tunnels:
  kong:
    addr: 192.168.99.100:32443
    proto: tls
    bind_tls: true
    hostname: orie.transmute.live
```


