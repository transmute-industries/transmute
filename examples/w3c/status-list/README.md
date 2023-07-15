# Status List

See also [status-list.vc](https://status-list.vc).

## Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/w3c/status-list/private.signing.jwk.json
```

## Export Public Verification Key

```sh
transmute key export \
--input  examples/w3c/status-list/private.signing.jwk.json \
--output examples/w3c/status-list/public.verifying.jwk.json
```

## Create New Status List

<!--
npm run transmute -- w3c status-list create \
--id https://example.com/credentials/status/3 \
--issuer https://key.transparency/issuer/42 \
--valid-from 2019-05-25T03:10:16.992Z \
--purpose revocation \
--length 8 \
--claimset examples/w3c/status-list/claimset.json
-->

## Compute Issuer ID

<!--
npm run transmute -- w3c controller create \
--issuer-key examples/w3c/status-list/public.verifying.jwk.json \
--controller examples/w3c/status-list/did.json
-->

```sh
jq -r '.id' examples/w3c/status-list/did.json
```


## Issue Status List Credential

<!--
npm run transmute -- w3c credential issue \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--issuer-kid did:jwk:eyJraWQiOiJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQ6c2hhLTI1NjpnZThnZVZxTS13dFBlVllkemhzY3ZXRDdOcXktdkdNYVBnLTZqYWFLWFljIiwia3R5IjoiRUMiLCJjcnYiOiJQLTM4NCIsImFsZyI6IkVTMzg0IiwieCI6IklzOHJRQzVsMDF4XzJjQXJXRUFvSF9IczVhQ0prQXFzNWtETTRWb1Ayd2JfUFZpclZUS0loLVIxMEJqUTUxQWwiLCJ5IjoiWXFnT21qWi1ZOTBCS1Vid0dMc3ZIbXdtRUtPSGh1aGcxYUYyZlBOempQUk83WUpHLU9fX0JJM0c1T3B1Tm8yYiJ9#0 \
--claimset  examples/w3c/status-list/claimset.json \
--verifiable-credential examples/w3c/status-list/status-list.vc.jwt
-->


## Verify Status List Credential

<!--
npm run transmute -- w3c credential verify \
--verifiable-credential examples/w3c/status-list/status-list.vc.jwt
-->

## Add Credential Status

```sh
transmute w3c status-list add \
--id https://status-list.vc/1 \
--type StatusList2021Entry \
--purpose revocation \
--index 0 \
--claimset examples/w3c/status-list/credential-with-status.claimset.json
```

<!--
npm run transmute -- w3c status-list add \
--id https://status-list.vc/1 \
--type StatusList2021Entry \
--purpose revocation \
--index 0 \
--claimset examples/w3c/status-list/credential-with-status.claimset.json
-->

## Issue Credential With Status

```sh
transmute w3c credential issue \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--issuer-kid did:jwk:eyJraWQiOiJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQ6c2hhLTI1NjpnZThnZVZxTS13dFBlVllkemhzY3ZXRDdOcXktdkdNYVBnLTZqYWFLWFljIiwia3R5IjoiRUMiLCJjcnYiOiJQLTM4NCIsImFsZyI6IkVTMzg0IiwieCI6IklzOHJRQzVsMDF4XzJjQXJXRUFvSF9IczVhQ0prQXFzNWtETTRWb1Ayd2JfUFZpclZUS0loLVIxMEJqUTUxQWwiLCJ5IjoiWXFnT21qWi1ZOTBCS1Vid0dMc3ZIbXdtRUtPSGh1aGcxYUYyZlBOempQUk83WUpHLU9fX0JJM0c1T3B1Tm8yYiJ9#0 \
--claimset  examples/w3c/status-list/credential-with-status.claimset.json \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
```

<!--
npm run transmute -- w3c credential issue \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--issuer-kid did:jwk:eyJraWQiOiJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQ6c2hhLTI1NjpnZThnZVZxTS13dFBlVllkemhzY3ZXRDdOcXktdkdNYVBnLTZqYWFLWFljIiwia3R5IjoiRUMiLCJjcnYiOiJQLTM4NCIsImFsZyI6IkVTMzg0IiwieCI6IklzOHJRQzVsMDF4XzJjQXJXRUFvSF9IczVhQ0prQXFzNWtETTRWb1Ayd2JfUFZpclZUS0loLVIxMEJqUTUxQWwiLCJ5IjoiWXFnT21qWi1ZOTBCS1Vid0dMc3ZIbXdtRUtPSGh1aGcxYUYyZlBOempQUk83WUpHLU9fX0JJM0c1T3B1Tm8yYiJ9#0 \
--claimset  examples/w3c/status-list/credential-with-status.claimset.json \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
-->

## Verify a Credential with Status

```sh
transmute w3c credential verify \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
```

<!--
npm run transmute -- w3c credential verify \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
-->

## Validate a Credential with Status

```sh
transmute w3c credential validate \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
```

<!--
npm run transmute -- w3c credential validate \
--verifiable-credential examples/w3c/status-list/credential-with-status.vc.jwt
-->

## Update a status

<!--
npm run transmute -- w3c status-list update \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--verifiable-credential examples/w3c/status-list/status-list.vc.jwt \
--index 1 \
--status true
-->

```sh
transmute w3c status-list update \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--verifiable-credential examples/w3c/status-list/status-list.vc.jwt \
--index 1 \
--status true
```
