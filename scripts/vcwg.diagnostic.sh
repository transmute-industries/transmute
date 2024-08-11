npm run build

# echo '{
#   "@context": [
#     "https://www.w3.org/ns/credentials/v2",
#     "https://www.w3.org/ns/credentials/examples/v2"
#   ],
#   "type": ["VerifiableCredential", "MyPrototypeCredential"],
#   "credentialSubject": {
#     "mySubjectProperty": "mySubjectValue"
#   }
# }' > ./tests/fixtures/issuer-claims.json

# # JWT

# npm run -s transmute -- vcwg issuer-claims ./tests/fixtures/issuer-claims.json --output ./tests/fixtures/issuer-claims.yaml
# npm run -s transmute -- vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.yaml --credential-type application/vc-ld+jwt --output ./tests/fixtures/issuer-claims.jwt
# npm run -s transmute -- vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-claims.jwt  --credential-type application/vc-ld+jwt --output ./tests/fixtures/issuer-claims.jwt.verified.json
# npm run -s transmute -- vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.jwt --credential-type application/vc-ld+jwt --presentation-type application/vp-ld+jwt  --output ./tests/fixtures/holder-claims.jwt
# npm run -s transmute -- vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-claims.jwt  --presentation-type application/vp-ld+jwt --output ./tests/fixtures/holder-claims.jwt.verified.json

# SD-JWT

# echo '"@context":
#   - https://www.w3.org/ns/credentials/v2
#   - https://www.w3.org/ns/credentials/examples/v2
# type:
#   - VerifiableCredential
#   - MyPrototypeCredential
# credentialSubject:
#   !sd mySubjectProperty: mySubjectValue
# ' > ./tests/fixtures/issuer-disclosable-claims.yaml

# echo '"@context":
#   - https://www.w3.org/ns/credentials/v2
#   - https://www.w3.org/ns/credentials/examples/v2
# type:
#   - VerifiableCredential
#   - MyPrototypeCredential
# credentialSubject:
#   mySubjectProperty: mySubjectValue
# ' > ./tests/fixtures/holder-disclosed-claims.yaml

# npm run -s transmute -- vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.yaml --credential-type application/vc-ld+sd-jwt --output ./tests/fixtures/issuer-disclosable-claims.sd-jwt
# npm run -s transmute -- vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.sd-jwt  --credential-type application/vc-ld+sd-jwt --output ./tests/fixtures/issuer-disclosable-claims.sd-jwt.verified.json
# npm run -s transmute -- vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.sd-jwt ./tests/fixtures/holder-disclosed-claims.yaml --credential-type application/vc-ld+sd-jwt --presentation-type application/vp-ld+sd-jwt --output ./tests/fixtures/holder-disclosed-claims.sd-jwt
# npm run -s transmute -- vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-disclosed-claims.sd-jwt  --presentation-type application/vp-ld+sd-jwt --output ./tests/fixtures/holder-disclosed-claims.sd-jwt.verified.json

# COSE

npm run -s transmute -- vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.yaml --credential-type application/vc-ld+cose --output ./tests/fixtures/issuer-claims.cbor
npm run -s transmute -- vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-claims.cbor  --credential-type application/vc-ld+cose --output ./tests/fixtures/issuer-claims.cbor.verified.json
npm run -s transmute -- vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.cbor --credential-type application/vc-ld+cose --presentation-type application/vp-ld+cose  --output ./tests/fixtures/holder-claims.cbor
npm run -s transmute -- vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-claims.cbor  --presentation-type application/vp-ld+cose --output ./tests/fixtures/holder-claims.cbor.verified.json
