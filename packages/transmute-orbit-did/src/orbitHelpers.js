const OrbitDB = require("orbit-db");

const transmuteDID = require("@transmute/transmute-did");

const {
  TransmuteAdapterOrbitDB,
  CustomTestKeystore
} = require("@transmute/transmute-adapter-orbit-db");

const ipfsOptions = {
  repo: "/orbitdb/examples/browser/new/ipfs/0.27.3",
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
};

const {
  createOrbitDIDResolver,
  createOrbitClaimResolver
} = transmuteDID.did.orbitDID;

const getOrbitDBFromKeypair = async (ipfsOptions, keypair) => {
  const ipfs = new window.Ipfs(ipfsOptions);

  return new Promise((resolve, reject) => {
    ipfs.on("ready", async () => {
      // console.log("keypair: ", keypair);
      const keystore = new CustomTestKeystore(keypair);
      // Create OrbitDB instance
      const orbitdb = new OrbitDB(ipfs, "./orbitdb", {
        peerID: keypair.publicKey,
        keystore: keystore
      });

      resolve(orbitdb);
    });
  });
};

export {
  transmuteDID,
  TransmuteAdapterOrbitDB,
  ipfsOptions,
  getOrbitDBFromKeypair,
  createOrbitDIDResolver,
  createOrbitClaimResolver
};
