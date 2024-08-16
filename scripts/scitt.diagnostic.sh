
# notary keys
npm run -s transmute -- cose keygen \
--alg ES256 \
--output ./tests/fixtures/private.notary.key.cbor > ./tests/fixtures/private.notary.key.diag

npm run -s transmute -- cose keypub \
./tests/fixtures/private.notary.key.cbor \
--output ./tests/fixtures/public.notary.key.cbor > ./tests/fixtures/public.notary.key.diag


# sign statement
npm run -s transmute -- scitt issue-statement \
./tests/fixtures/private.notary.key.cbor \
./tests/fixtures/message.json \
--output ./tests/fixtures/message.hash-envelope.cbor > ./tests/fixtures/message.hash-envelope.diag

# verify statement
npm run -s transmute -- scitt verify-statement-hash \
./tests/fixtures/public.notary.key.cbor \
./tests/fixtures/message.hash-envelope.cbor \
3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 \
--output ./tests/fixtures/message.hash-envelope.verified.data > ./tests/fixtures/message.hash-envelope.diag

# sign receipt
npm run -s transmute -- scitt issue-receipt \
./tests/fixtures/private.notary.key.cbor \
./tests/fixtures/message.hash-envelope.cbor \
--log ./tests/fixtures/trans.json \
--output ./tests/fixtures/message.hash-envelope-with-receipt.cbor > ./tests/fixtures/message.hash-envelope-with-receipt.diag

# verify receipt
npm run -s transmute -- scitt verify-receipt-hash \
./tests/fixtures/public.notary.key.cbor \
./tests/fixtures/message.hash-envelope-with-receipt.cbor \
3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 > ./tests/fixtures/message.hash-envelope-with-receipt.diag

# azure key vault

npm run -s transmute -- scitt issue-statement \
./tests/fixtures/message.json \
--env ./.env \
--alg ES256 \
--iss https://software.vendor.example \
--sub https://software.vendor.example/product/123 \
--content-type application/spdx+json \
--location https://software.vendor.example/storage/456 \
--output ./tests/fixtures/message.json.akv.cbor \
--azure-keyvault

npm run -s transmute -- scitt issue-receipt \
./tests/fixtures/message.json.akv.cbor \
--env ./.env \
--log ./tests/fixtures/trans.json \
--output ./tests/fixtures/message.akv.receipt.cbor \
--azure-keyvault

npm run -s transmute -- scitt export-remote-public-key \
--env ./.env \
--output ./tests/fixtures/public.akv.key.cbor \
--azure-keyvault

npm run -s transmute -- scitt verify-statement-hash \
./tests/fixtures/public.akv.key.cbor \
./tests/fixtures/message.json.akv.cbor \
3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22

echo

npm run -s transmute -- scitt verify-receipt-hash \
./tests/fixtures/public.akv.key.cbor \
./tests/fixtures/message.akv.receipt.cbor \
3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22