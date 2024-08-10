# <a href="https://transmute.industries">Transmute Command</a>

[![CI](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/transmute/actions/workflows/ci.yml)
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
