rm -rf  ./dist/_manifest
sbom-tool generate -b ./dist -bc ./ -pn transmute -ps transmute.industries -pv `jq -r .version package.json` -nsu `git rev-parse --verify HEAD`

npm run -s transmute -- scitt issue-statement ./tests/fixtures/private.notary.key.cbor ./dist/_manifest/spdx_2.2/manifest.spdx.json \
--iss https://software.vendor.example \
--sub `jq -r .documentNamespace ./dist/_manifest/spdx_2.2/manifest.spdx.json` \
--content-type application/spdx+json \
--location https://github.com/transmute-industries/transmute/blob/main/dist/_manifest/spdx_2.2/manifest.spdx.json \
--output ./dist/_manifest/spdx_2.2/manifest.spdx.scitt.cbor

npm run -s transmute -- scitt issue-receipt ./tests/fixtures/private.notary.key.cbor ./dist/_manifest/spdx_2.2/manifest.spdx.scitt.cbor \
--iss https://software.notary.example \
--sub `jq -r .documentNamespace ./dist/_manifest/spdx_2.2/manifest.spdx.json` \
--log ./tests/fixtures/trans.json \
--output ./dist/_manifest/spdx_2.2/manifest.spdx.scitt.cbor

npm run -s transmute -- scitt verify-receipt-hash ./tests/fixtures/public.notary.key.cbor ./dist/_manifest/spdx_2.2/manifest.spdx.scitt.cbor `cat ./dist/_manifest/spdx_2.2/manifest.spdx.json.sha256`
