
# sign hash envelope
npm run -s transmute -- scitt sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --output ./tests/fixtures/message.hash-envelope.cbor > ./tests/fixtures/message.hash-envelope.diag
npm run -s transmute -- scitt verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.hash-envelope.cbor 3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 --output ./tests/fixtures/message.hash-envelope.verified.data > ./tests/fixtures/message.hash-envelope.diag
