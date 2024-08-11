
# notary keys
npm run -s transmute -- cose keygen --alg ES256 --output ./tests/fixtures/private.notary.key.cbor > ./tests/fixtures/private.notary.key.diag
npm run -s transmute -- cose keypub ./tests/fixtures/private.notary.key.cbor --output ./tests/fixtures/public.notary.key.cbor > ./tests/fixtures/public.notary.key.diag


# sign hash envelope
npm run -s transmute -- scitt issue-statement ./tests/fixtures/private.notary.key.cbor ./tests/fixtures/message.json --output ./tests/fixtures/message.hash-envelope.cbor > ./tests/fixtures/message.hash-envelope.diag
npm run -s transmute -- scitt verify-statement-hash ./tests/fixtures/public.notary.key.cbor ./tests/fixtures/message.hash-envelope.cbor 3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 --output ./tests/fixtures/message.hash-envelope.verified.data > ./tests/fixtures/message.hash-envelope.diag

# sign receipt
npm run -s transmute -- scitt issue-receipt ./tests/fixtures/private.notary.key.cbor ./tests/fixtures/message.hash-envelope.cbor --log ./tests/fixtures/trans.json --output ./tests/fixtures/message.hash-envelope-with-receipt.cbor > ./tests/fixtures/message.hash-envelope-with-receipt.diag
npm run -s transmute -- scitt verify-receipt-hash ./tests/fixtures/public.notary.key.cbor ./tests/fixtures/message.hash-envelope-with-receipt.cbor 3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 > ./tests/fixtures/message.hash-envelope-with-receipt.diag