# <a href="https://transmute.industries">Transmute Command</a> 

[![CI](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml)

<!-- [![NPM](https://nodei.co/npm/@transmute/transmute.png?mini=true)](https://npmjs.org/package/@transmute/transmute) -->

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=cli) | <a href="https://platform.transmute.industries">Transmute VDP</a> | <a href="https://guide.transmute.industries/verifiable-data-platform/">Our Guide</a> | <a href="https://transmute.industries">About Transmute</a>

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

### Commands

#### Push Graph to Neo4j

```sh
transmute graph \
--env .env \
--file ./src/__fixtures__/_minimal-credential.json
```

#### Convert to JSON Graph

```sh
transmute graph \
--file ./src/__fixtures__/_minimal-credential.json \
--accept application/vnd.transmute.graph+json
```

#### Convert to Cypher

```sh
transmute graph \
--file ./src/__fixtures__/_minimal-credential.json \
--accept application/vnd.transmute.cypher \
--unsafe
```

## Develop

```
npm i
npm t
```

### Testing CLI Locally

#### Install local build on CLI

```sh
npm i -g .
```

Then see the usage section above, or use the npm script aliases, below:

#### JSON-LD to JSON Graph

```sh
npm run transmute -- graph \
--accept application/vnd.transmute.graph+json \
--file ./src/__fixtures__/_minimal-credential.json
```

#### JSON-LD to Cypher

```sh
npm --silent run transmute -- graph \
--accept application/vnd.transmute.cypher+json \
--file ./src/__fixtures__/_minimal-credential.json \
| jq -r '.query'
```

#### Push JSON-LD to Neo4j

```sh
npm --silent run transmute -- graph \
--env .env \
--file ./src/__fixtures__/_minimal-credential.json
```

### Testing GitHub Actions Locally

You will need to use a remote neo4j instance to test with act locally.

Help wanted resolving related docker network issues.

```
act -j act-preview-neo4j --secret-file .env
```
