rm ./tests/fixtures/*
echo '{"message":"⌛ My lungs taste the air of Time Blown past falling sands"}' > ./tests/fixtures/message.json
npm run build

# signing keys
npm run -s transmute -- cose keygen --alg ES256 --output ./tests/fixtures/private.sig.key.cbor > ./tests/fixtures/private.sig.key.edn
