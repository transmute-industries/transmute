rm ./tests/fixtures/*
echo '{"message":"⌛ My lungs taste the air of Time Blown past falling sands"}' > ./tests/fixtures/message.json

npm run build

./scripts/jose.diagnostic.sh
./scripts/cose.diagnostic.sh
./scripts/scitt.diagnostic.sh
./scripts/vcwg.diagnostic.sh