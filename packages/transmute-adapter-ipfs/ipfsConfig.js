const localIPFSConfig = {
  host: "localhost",
  port: 5001,
  protocol: "http"
};

const minikubeConfig = {
  host: "ipfs.transmute.minikube",
  port: 32443,
  protocol: "http"
};

module.exports =
  process.env.TRANSMUTE_ENV === "minikube" ? minikubeConfig : localIPFSConfig;
