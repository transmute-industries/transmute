# W3C Verifiable Credentials

## Credentials

### Issue

```sh
npm run transmute -- credential create \
--input 'examples/vcdm/credential.json' \
--output 'examples/vcdm/credential.jwt.flat.json' \
--key 'examples/keys/private.ES384.json'
```

### Verify

```sh
npm run transmute -- credential verify \
--input 'examples/vcdm/credential.jwt.flat.json' \
--output 'examples/vcdm/credential.jwt.flat.verified.json' \
--key 'examples/keys/public.ES384.json'
```

## Presentations

### Issue

```sh
npm run transmute -- presentation create \
--input 'examples/vcdm/presentation.json' \
--output 'examples/vcdm/presentation.jwt.flat.json' \
--key 'examples/keys/private.ES384.json'
```

### Verify

```sh
npm run transmute -- presentation verify \
--input 'examples/vcdm/presentation.jwt.flat.json' \
--output 'examples/vcdm/presentation.jwt.flat.verified.json' \
--key 'examples/keys/public.ES384.json'
```
