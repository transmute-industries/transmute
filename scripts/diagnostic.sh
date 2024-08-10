rm ./scripts/diagnostic/*
echo '{"message":"⌛ My lungs taste the air of Time Blown past falling sands"}' > ./scripts/diagnostic/message.json
npm run build
npm run -s transmute -- jose keygen --alg ES256 > ./scripts/diagnostic/private.jwk.json
npm run -s transmute -- jose keypub ./scripts/diagnostic/private.jwk.json > ./scripts/diagnostic/public.jwk.json

# attached 
npm run -s transmute -- jose sign ./scripts/diagnostic/private.jwk.json ./scripts/diagnostic/message.json > ./scripts/diagnostic/message.signature.json
npm run -s transmute -- jose verify ./scripts/diagnostic/public.jwk.json ./scripts/diagnostic/message.signature.json > ./scripts/diagnostic/message.signature.verified.json

# detached
npm run -s transmute -- jose sign ./scripts/diagnostic/private.jwk.json ./scripts/diagnostic/message.json --detached > ./scripts/diagnostic/message.signature.detached.json
npm run -s transmute -- jose verify ./scripts/diagnostic/public.jwk.json ./scripts/diagnostic/message.signature.detached.json ./scripts/diagnostic/message.json --detached> ./scripts/diagnostic/message.signature.detached.verified.json

# detached compact
npm run -s transmute -- jose sign ./scripts/diagnostic/private.jwk.json ./scripts/diagnostic/message.json --detached --compact > ./scripts/diagnostic/message.signature.detached.compact.jws
npm run -s transmute -- jose verify ./scripts/diagnostic/public.jwk.json ./scripts/diagnostic/message.signature.detached.compact.jws ./scripts/diagnostic/message.json --detached --compact > ./scripts/diagnostic/message.signature.detached.compact.jws.verified.json
