# W3C Verifiable Credentials

(JSON Serialization Experiment)

## Controllers

### JSON Controller

```sh
transmute controller create \
--accept 'application/did+json' \
--input  'examples/jose/public.verifying.jwk.json' \
--output 'examples/vcdm/did.json'
```

### JSON-LD Controller

```sh
transmute controller create \
--accept 'application/did+ld+json' \
--input  'examples/jose/public.verifying.jwk.json' \
--output 'examples/vcdm/did.jsonld'
```

## Credentials

### Issue

```sh
transmute credential create \
--input 'examples/vcdm/credential.json' \
--output 'examples/vcdm/credential.jwt.flat.json' \
--key 'examples/keys/private.ES384.json'
```

### Verify

```sh
transmute credential verify \
--input 'examples/vcdm/credential.jwt.flat.json' \
--output 'examples/vcdm/credential.jwt.flat.verified.json' \
--key 'examples/keys/public.ES384.json'
```

## Presentations

### Issue

```sh
transmute presentation create \
--input 'examples/vcdm/presentation.json' \
--output 'examples/vcdm/presentation.jwt.flat.json' \
--key 'examples/keys/private.ES384.json'
```

### Verify

```sh
transmute presentation verify \
--input 'examples/vcdm/presentation.jwt.flat.json' \
--output 'examples/vcdm/presentation.jwt.flat.verified.json' \
--key 'examples/keys/public.ES384.json'
```
