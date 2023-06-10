# <a href="https://platform.transmute.industries">Verifiable Data Platform</a> GitHub Action

[![CI](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml)

<!-- [![NPM](https://nodei.co/npm/@transmute/transmute.png?mini=true)](https://npmjs.org/package/@transmute/transmute) -->

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=cli) | <a href="https://platform.transmute.industries">Transmute VDP</a> | <a href="https://guide.transmute.industries/verifiable-data-platform/">Our Guide</a> | <a href="https://transmute.industries">About Transmute</a>

## Usage

```sh
npm i -g @transmute/cli
```

### Push Graph to Neo4j

```sh
transmute graph --env .env --file ./src/__fixtures__/_minimal-credential.json
```

### Convert to JSON Graph

```sh
transmute graph --file ./src/__fixtures__/_minimal-credential.json --accept application/vnd.transmute.graph+json
```

### Convert to Cypher

```sh
transmute graph --file ./src/__fixtures__/_minimal-credential.json --accept application/vnd.transmute.cypher --unsafe
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
npm run transmute -- graph --accept application/vnd.transmute.graph+json --file ./src/__fixtures__/_minimal-credential.json
```

#### JSON-LD to Cypher

```sh
npm --silent run transmute -- graph --accept application/vnd.transmute.cypher+json --file ./src/__fixtures__/_minimal-credential.json \
| jq -r '.query'
```

#### Push JSON-LD to Neo4j

```sh
npm --silent run transmute -- graph --env .env --file ./src/__fixtures__/_minimal-credential.json
```

### Testing GitHub Actions Locally

You will need to use a remote neo4j instance to test with act locally.

Help wanted resolving related docker network issues.

```
act -j act-preview-neo4j --secret-file .env
```
