npm run build

echo '{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/examples/v2"
  ],
  "type": ["VerifiableCredential", "MyPrototypeCredential"],
  "credentialSubject": {
    "mySubjectProperty": "mySubjectValue"
  }
}' > ./tests/fixtures/issuer-claims.json

npm run -s transmute -- vcwg issuer-claims ./tests/fixtures/issuer-claims.json --output ./tests/fixtures/issuer-claims.yaml
npm run -s transmute -- vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.yaml --credential-type application/vc-ld+jwt --output ./tests/fixtures/issuer-claims.jwt
npm run -s transmute -- vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-claims.jwt  --credential-type application/vc-ld+jwt --output ./tests/fixtures/issuer-claims.jwt.verified.json
npm run -s transmute -- vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.jwt --credential-type application/vc-ld+jwt --presentation-type application/vp-ld+jwt  --output ./tests/fixtures/holder-claims.jwt
npm run -s transmute -- vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-claims.jwt  --presentation-type application/vp-ld+jwt --output ./tests/fixtures/holder-claims.jwt.verified.json