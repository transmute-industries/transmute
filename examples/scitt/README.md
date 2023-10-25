# Supply Chain Integrity, Transparency, and Trust (scitt)

- [datatracker](https://datatracker.ietf.org/wg/scitt/about/)


## Create Private Signing Key

```sh
npm run transmute -- scitt key generate \
--alg -35 \
--output examples/scitt/artifacts/privateKey.cose
```

## Export Public Verification Key

```sh
npm run transmute -- scitt key export \
--input  examples/scitt/artifacts/privateKey.cose \
--output examples/scitt/artifacts/publicKey.cose
```

## View COSE Keys as Diagnostic

```sh
npm run transmute -- scitt key diagnose \
--input  examples/scitt/artifacts/privateKey.cose \
--output examples/scitt/artifacts/privateKey.cose.diag
```

If the output is markdown, the diagnostic is wrapped in markdown code blocks:

```sh
npm run transmute -- scitt key diagnose \
--input  examples/scitt/artifacts/publicKey.cose \
--output examples/scitt/artifacts/publicKey.cose.md
```

## Sign Statement

```sh
npm run transmute -- scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cose \
--statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml \
--signed-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cose
```

```sh
npm run transmute -- scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cose \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cose
```

## View Signed Statement as Diagnostic


```sh
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.cose \
--output examples/scitt/artifacts/sbom-tool.spdx.json.cose.md
```

## Verify Signed Statement

```sh
npm run transmute -- scitt statement verify \
--issuer-key examples/scitt/artifacts/publicKey.cose \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cose
```

## Create Transparent Statement

```sh
npm run transmute -- scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cose \
--signed-statement  examples/scitt/artifacts/sbom-tool.spdx.json.cose \
--transparent-statement examples/scitt/artifacts/sbom-tool.spdx.json.ts.cose \
--ledger  examples/scitt/artifacts/ledger.sqlite
```

```sh
npm run transmute -- scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cose \
--signed-statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cose \
--transparent-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cose \
--ledger  examples/scitt/artifacts/ledger.sqlite
```

## Verify Transparent Statement

```sh
npm run transmute -- scitt transparent statement verify \
--issuer-key examples/scitt/artifacts/publicKey.cose \
--transparency-service-key examples/scitt/artifacts/publicKey.cose \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--transparent-statement examples/scitt/artifacts/sbom-tool.spdx.json.ts.cose
```
 
## View Transparent Statement as Diagnostic


```sh
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.ts.cose \
--output examples/scitt/artifacts/sbom-tool.spdx.json.ts.cose.md
```

```sh
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cose \
--output examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cose.md
```

### x509 Certificates

... sigh ...

#### Create A Root Certificate

```sh
npm run transmute -- scitt certificate create \
--alg ES384 \
--issuer "CN=Test CA" \
--subject "CN=Test CA" \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--subject-guid f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
--subject-did did:web:root.transparency.example \
--subject-private-key examples/scitt/artifacts/x.509.ca.cert.privateKey.cose \
--subject-certificate examples/scitt/artifacts/x.509.ca.cert.publicKey.pem
```



#### Create A User Certificate

```sh
npm run transmute -- scitt certificate create \
--alg ES384 \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--issuer-private-key examples/scitt/artifacts/x.509.ca.cert.privateKey.cose \
--issuer-certificate examples/scitt/artifacts/x.509.ca.cert.publicKey.pem \
--subject "CN=Test, O=Дом" \
--subject-did did:web:issuer.key.transparency.example \
--subject-private-key examples/scitt/artifacts/x.509.user.privateKey.cose \
--subject-public-key examples/scitt/artifacts/x.509.user.publicKey.cose \
--subject-certificate examples/scitt/artifacts/x.509.user.cert.publicKey.pem
```

## View COSE Keys as Diagnostic

```sh
npm run transmute -- scitt key diagnose \
--input  examples/scitt/artifacts/x.509.user.publicKey.cose \
--output examples/scitt/artifacts/x.509.user.publicKey.cose.diag.md
```
