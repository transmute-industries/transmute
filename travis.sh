
# lerna clean
# lerna bootrstrap
# lerna run cleanup
# lerna run contracts:migrate
# lerna run contracts:generate
# lerna bootstrap
# lerna run test --scope transmute-framework

# migrate -> generate -> test
lerna bootstrap
cd ./packages/transmute-contracts
yarn cleanup
yarn contracts:migrate
cd ../../packages/transmute-framework
yarn install
lerna bootstrap
yarn cleanup
yarn contracts:generate
yarn test
