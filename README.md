# <a href="https://transmute.industries">Transmute</a>

[![CI](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml)
[![NPM](https://nodei.co/npm/@transmute/cli.png?mini=true)](https://npmjs.org/package/@transmute/cli)

#### [Questions?](https://transmute.typeform.com/to/RshfIw?typeform-source=cli)

## Usage

### GitHub Action

```yaml
name: CI
on: [push]
jobs:
  scitt:
    runs-on: ubuntu-latest
    steps:
      - name: Issue Statement
        id: issue_statement
        uses: transmute-industries/transmute@main
        with:
          transmute: |
            scitt issue-statement ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --output ./tests/fixtures/message.hash-envelope.cbor
      - name: Verify Statement Hash
        id: verify_message
        uses: transmute-industries/transmute@main
        with:
          transmute: |
            scitt verify-statement-hash ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.hash-envelope.cbor 3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22
```

See [CI](./.github/workflows/ci.yml) for more examples.

### Nodejs CLI

Install as global binary:

```sh
npm i -g @transmute/cli
```

#### Getting Started

```sh

echo '"@context":
  - https://www.w3.org/ns/credentials/v2
  - https://www.w3.org/ns/credentials/examples/v2
type:
  - VerifiableCredential
  - MyPrototypeCredential
credentialSubject:
  !sd mySubjectProperty: mySubjectValue
' > ./tests/fixtures/issuer-disclosable-claims.yaml

echo '"@context":
  - https://www.w3.org/ns/credentials/v2
  - https://www.w3.org/ns/credentials/examples/v2
type:
  - VerifiableCredential
  - MyPrototypeCredential
credentialSubject:
  mySubjectProperty: mySubjectValue
' > ./tests/fixtures/holder-disclosed-claims.yaml

transmute jose keygen --alg ES256 \
--output ./tests/fixtures/private.sig.jwk.json

transmute vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.yaml \
--credential-type application/vc-ld+sd-jwt \
--output ./tests/fixtures/issuer-disclosable-claims.sd-jwt
```

See [scripts](./scripts/) for more examples.

TODO: all command examples
