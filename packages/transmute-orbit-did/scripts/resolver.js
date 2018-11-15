var http = require("http");

const {
  getReadyIPFS,
  createKeypair,
  getOrbitDBFromKeypair,
  ipfsOptions
} = require("@transmute/transmute-adapter-orbit-db");

const transmuteDID = require("@transmute/transmute-did");

console.log("Resolver Started: ");

const didData = require("../src/orbitdb.transmute.openpgp.did.json");

const { createOrbitDIDResolver } = require("./orbitHelpers");

console.log(`http://localhost:7000/1.0/identifiers/${didData.orbitDID}`);

(async () => {
  const node = await getReadyIPFS(ipfsOptions);
  const resolverKeypair = await createKeypair();
  const orbitdb = await getOrbitDBFromKeypair(node, resolverKeypair);
  const resolver = createOrbitDIDResolver(orbitdb);

  http
    .createServer(async (req, resp) => {
      if (req.url === "/favicon.ico") {
        resp.writeHead(200, { "Content-type": "text/plan" });
        resp.write("Hello Node JS Server Response");
        resp.end();
      }

      if (req.url.indexOf("/1.0/identifiers/") === 0) {
        const did = req.url.split("/1.0/identifiers/")[1];

        try {
          const object = await resolver.resolve(did);
          const didDoc = JSON.stringify(object);
          resp.writeHead(200, { "Content-type": "application/json" });
          resp.write(didDoc);
        } catch (e) {
          console.log(e);
          resp.writeHead(500, { "Content-type": "application/json" });
          resp.write(
            JSON.stringify({
              error: 406,
              message: "DID Document signature could not be verified."
            })
          );
        }

        resp.end();
      }
    })

    .listen(7000);
})();
