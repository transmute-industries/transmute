rm ./scripts/diagnostic/*
echo '{"message":"⌛ My lungs taste the air of Time Blown past falling sands"}' > ./scripts/diagnostic/message.json
npm run build

# signing keys
npm run -s transmute -- jose keygen --alg ES256 > ./scripts/diagnostic/private.sig.jwk.json
npm run -s transmute -- jose keypub ./scripts/diagnostic/private.sig.jwk.json > ./scripts/diagnostic/public.sig.jwk.json

# encryption keys
npm run -s transmute -- jose keygen --alg ECDH-ES+A128KW --crv P-384 > ./scripts/diagnostic/private.enc.jwk.json
npm run -s transmute -- jose keypub ./scripts/diagnostic/private.enc.jwk.json > ./scripts/diagnostic/public.enc.jwk.json

# attached 
npm run -s transmute -- jose sign ./scripts/diagnostic/private.sig.jwk.json ./scripts/diagnostic/message.json > ./scripts/diagnostic/message.signature.json
npm run -s transmute -- jose verify ./scripts/diagnostic/public.sig.jwk.json ./scripts/diagnostic/message.signature.json > ./scripts/diagnostic/message.signature.verified.json

# detached
npm run -s transmute -- jose sign ./scripts/diagnostic/private.sig.jwk.json ./scripts/diagnostic/message.json --detached > ./scripts/diagnostic/message.signature.detached.json
npm run -s transmute -- jose verify ./scripts/diagnostic/public.sig.jwk.json ./scripts/diagnostic/message.signature.detached.json ./scripts/diagnostic/message.json --detached> ./scripts/diagnostic/message.signature.detached.verified.json

# detached compact
npm run -s transmute -- jose sign ./scripts/diagnostic/private.sig.jwk.json ./scripts/diagnostic/message.json --detached --compact > ./scripts/diagnostic/message.signature.detached.compact.jws
npm run -s transmute -- jose verify ./scripts/diagnostic/public.sig.jwk.json ./scripts/diagnostic/message.signature.detached.compact.jws ./scripts/diagnostic/message.json --detached --compact > ./scripts/diagnostic/message.signature.detached.compact.jws.verified.json

# encrypt
npm run -s transmute -- jose encrypt ./scripts/diagnostic/public.enc.jwk.json ./scripts/diagnostic/message.json --enc A128GCM > ./scripts/diagnostic/message.ciphertext.json
npm run -s transmute -- jose decrypt ./scripts/diagnostic/private.enc.jwk.json ./scripts/diagnostic/message.ciphertext.json --output ./scripts/diagnostic/message.plaintext.json > ./scripts/diagnostic/message.decrypted.json