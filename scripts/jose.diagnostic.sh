# signing keys
npm run -s transmute -- jose keygen --alg ES256 > ./tests/fixtures/private.sig.jwk.json
npm run -s transmute -- jose keypub ./tests/fixtures/private.sig.jwk.json > ./tests/fixtures/public.sig.jwk.json

# encryption keys
npm run -s transmute -- jose keygen --alg ECDH-ES+A128KW --crv P-384 > ./tests/fixtures/private.enc.jwk.json
npm run -s transmute -- jose keypub ./tests/fixtures/private.enc.jwk.json > ./tests/fixtures/public.enc.jwk.json

# attached 
npm run -s transmute -- jose sign ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/message.json > ./tests/fixtures/message.signature.json
npm run -s transmute -- jose verify ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/message.signature.json --output ./tests/fixtures/message.verified.json > ./tests/fixtures/message.signature.verified.json

# detached
npm run -s transmute -- jose sign ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/message.json --detached > ./tests/fixtures/message.signature.detached.json
npm run -s transmute -- jose verify ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/message.signature.detached.json ./tests/fixtures/message.json --detached> ./tests/fixtures/message.signature.detached.verified.json

# detached compact
npm run -s transmute -- jose sign ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/message.json --detached --compact > ./tests/fixtures/message.signature.detached.compact.jws
npm run -s transmute -- jose verify ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/message.signature.detached.compact.jws ./tests/fixtures/message.json --detached --compact > ./tests/fixtures/message.signature.detached.compact.jws.verified.json

# encrypt
npm run -s transmute -- jose encrypt ./tests/fixtures/public.enc.jwk.json ./tests/fixtures/message.json --enc A128GCM > ./tests/fixtures/message.ciphertext.json
npm run -s transmute -- jose decrypt ./tests/fixtures/private.enc.jwk.json ./tests/fixtures/message.ciphertext.json --output ./tests/fixtures/message.plaintext.json > ./tests/fixtures/message.decrypted.json

# encrypt compact
npm run -s transmute -- jose encrypt ./tests/fixtures/public.enc.jwk.json ./tests/fixtures/message.json --enc A128GCM --compact > ./tests/fixtures/message.ciphertext.compact.jwe
npm run -s transmute -- jose decrypt ./tests/fixtures/private.enc.jwk.json ./tests/fixtures/message.ciphertext.compact.jwe --output ./tests/fixtures/message.plaintext.json --compact > ./tests/fixtures/message.decrypted.json