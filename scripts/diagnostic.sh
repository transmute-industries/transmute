rm ./scripts/diagnostic/*
npm run build
npm run -s transmute -- jose keygen --alg ES256 > ./scripts/diagnostic/private.jwk.json
