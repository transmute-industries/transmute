# Transmute Orbit DID

🚧 Under Construction. Not for production use! 🚧

<p align="center">
  <img src="../../transmute-banner.png"/>
</p>


This is an experiment, and usafe to use.

https://ipfs.io/ipns/orbit-did.transmute.world/

```
npm run did:wallet:create
npm run did:wallet:encrypt password123
npm run did:wallet:decrypt password123
npm run did:create
npm run did:resolver
npm run did:create:claim
npm run did:start
npm run did:clean
```

## What is it?

An implementation of DID using OrbitDB and Transmute DID

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.

- https://w3c-ccg.github.io/did-spec/
- https://github.com/orbitdb/orbit-db
- https://ipfs.io/

## How does it work?

We use Transmute DID to create a wallet containing some private keys.
We use the elliptic EC keys in the wallet to sign database operations in orbit db.
We generate a DID Document, in this case, we sign the document with an OpenPGP key.

Ignoring the custom DID Method (`openpgp:fingerprint`) for the moment, lets look a the data structure:

```
[
  {
    "_id": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae",
    "doc": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae",
      "publicKey": [
        {
          "id": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae#a0d396a110da86573bd1cc5a022ff921d6c7b6ab9898e089105c012811d8563f",
          "type": "Secp256k1VerificationKey2018",
          "owner": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae",
          "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+yfDxMFK4EEAAoCAwThZQ1ATWi6JiFgE2WdRkOBwRLGaqVA9SqbaXYq\r\nZnl7riBAn3JCEbpHjcxHVMCauQYEBLaGFNsUcgrmxJUn9uB0zQh0ZXN0LWtl\r\necJ3BBATCAAfBQJb7J8PBgsJBwgDAgQVCAoCAxYCAQIZAQIbAwIeAQAKCRAQ\r\nH4AMNEirriR2AP0RdCflRqe7Sr4TUHT6z597nvKfVO2P/R/UjwfCaUhzSwD/\r\nRn0cmqVFB6uL9sYdSljysofJroo4E4xzC+O3w9CqVRrOUwRb7J8PEgUrgQQA\r\nCgIDBAoDLkvddY4DRgB+btEUNF7lnrS3BgAvatwys5oO1ar2gBmKJ2SFsjK2\r\nKBiuIvACdI5nd88LnF4sHK+Zhs6j9KwDAQgHwmEEGBMIAAkFAlvsnw8CGwwA\r\nCgkQEB+ADDRIq65+SQEAv6B+Iec0d5v2ZhBcxWjzrUr038iANG+j5+OOKWuz\r\nbPoA/20D1XqpQOpmu8GjSNe5xvx3agk/LgRc/mTWqH0m0ADn\r\n=Bu9b\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
        },
        {
          "id": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae#4d99ab1a69b6a42b6cb4aa0b5f3b1c118632176c2f58c9a67895ab34d04eb8bd",
          "type": "Secp256k1VerificationKey2018",
          "owner": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae",
          "publicKeyHex": "04a5e814736e5ad0cf56456026aec330afe8ba949096a28eefafbb66493b4e7a965ac2476baaae1e4a3c714d59336ede41b44b2281f36ce4190649ab47af678adc"
        }
      ],
      "authentication": [
        {
          "publicKey": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae#a0d396a110da86573bd1cc5a022ff921d6c7b6ab9898e089105c012811d8563f",
          "type": "Secp256k1VerificationKey2018"
        },
        {
          "publicKey": "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae#4d99ab1a69b6a42b6cb4aa0b5f3b1c118632176c2f58c9a67895ab34d04eb8bd",
          "type": "Secp256k1VerificationKey2018"
        }
      ]
    },
    "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlvsqDgACgkQEB+ADDRIq65I6wEA6zpMZO0GgZ68bzXwH70T\r\n8gPwHpqWi0guNI7EuOmg9TsBAKrdX2CN25/RK7PMNDr26J+rtppEFdOjUP4o\r\nyNtv7zgX\r\n=5DEF\r\n-----END PGP SIGNATURE-----\r\n"
  }
]
```

If we import the PGP Public Key and take its fingerprint, we can see it matches the did noted in the document: `did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae`

We can see the signature format is PGP, and verify the signature matches the fingerprint.

We use an secp256k1 private key from the wallet to create a document database in orbit db, that is only writeable by this key.

```
const db = await orbitdb.docs(doc.id, {
    write: [
      // Give access to our did wallet private key
      orbitdb.key.getPublic("hex")
    ]
});

const address = db.address.toString()
```

Example Address:

`/orbitdb/QmQ8ZKRR4n8sA4PTMv7vX48rYwKjHWidd5fzn66kxHiCgZ/did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae`]

In order to replicate the database with peers, the address is what you need to give to other peers in order for them to start replicating the database.

[Learn more about Orbit DB Addresses](https://github.com/orbitdb/orbit-db/blob/master/GUIDE.md#address)

We can transform an Orbit DB Address into a valid DID:

`did:orbitdb.transmute.openpgp:QmQ8ZKRR4n8sA4PTMv7vX48rYwKjHWidd5fzn66kxHiCgZ.21b5ef5af61ce78cce35f9c0101f800c3448abae`


## About Demo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

[Deploying to IPFS](https://medium.com/coinmonks/how-to-add-site-to-ipfs-and-ipns-f121b4cfc8ee)
[More on IPNS](https://medium.com/textileio/the-definitive-guide-to-publishing-content-on-ipfs-ipns-dfe751f1e8d0)