rm ./tests/fixtures/*
echo '{"message":"⌛ My lungs taste the air of Time Blown past falling sands"}' > ./tests/fixtures/message.json
npm run build

# signing keys
npm run -s transmute -- cose keygen --alg ES256 --output ./tests/fixtures/private.sig.key.cbor > ./tests/fixtures/private.sig.key.diag
npm run -s transmute -- cose keypub ./tests/fixtures/private.sig.key.cbor --output ./tests/fixtures/public.sig.key.cbor > ./tests/fixtures/public.sig.key.diag

# sign attached
npm run -s transmute -- cose sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --output ./tests/fixtures/message.signature.cbor > ./tests/fixtures/message.signature.diag
npm run -s transmute -- cose verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.signature.cbor --output ./tests/fixtures/message.verified.data > ./tests/fixtures/message.signature.diag

# sign detached
npm run -s transmute -- cose sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --detached --output ./tests/fixtures/message.signature.detached.cbor > ./tests/fixtures/message.signature.detached.diag
npm run -s transmute -- cose verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.signature.detached.cbor ./tests/fixtures/message.json --detached --output ./tests/fixtures/message.detached.verified.data > ./tests/fixtures/message.signature.detached.diag
