# <a href="https://transmute.industries">Transmute Command</a> 

[![CI](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml)
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)
[![NPM](https://nodei.co/npm/@transmute/cli.png?mini=true)](https://npmjs.org/package/@transmute/cli)

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=cli) | <a href="https://platform.transmute.industries">Verifiable Data Platform</a> | <a href="https://guide.transmute.industries/verifiable-data-platform/">Our Guide</a> | <a href="https://transmute.industries">About Transmute</a>

## Usage

As a global binary:

```sh
npm i -g @transmute/cli
```

As a github action:

```yaml
- uses: transmute-industries/transmute@v0.8.2
  with:
    neo4j-uri: ${{ secrets.NEO4J_URI }}
    neo4j-user: ${{ secrets.NEO4J_USERNAME }}
    neo4j-password: ${{ secrets.NEO4J_PASSWORD }}
    json: |
      {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [
        ...
```

<img width="1404" alt="Screen Shot 2023-06-11 at 1 32 58 PM" src="https://github.com/transmute-industries/transmute/assets/8295856/2c568d13-f878-4a4d-a228-5cd6eb91969e">


### Commands

- [JOSE](./examples/jose)
- [W3C Verifiable Credentials](./examples/vcdm/)
- [Neo4j](./examples/neo4j)

## Develop

```
npm i
npm t
```

### Testing Commands

Install a local build of the cli globally using:

```sh
npm i -g .
```

Test a local build with this npm script alias:

```sh
npm run transmute -- controller key generate \
--alg ES384 \
--output examples/keys/private.ES384.json
```

### Testing GitHub Actions

You will need to use a remote neo4j instance to test with act locally.

Help wanted resolving related docker network issues.

```
act -j act-preview-neo4j --secret-file .env
```
