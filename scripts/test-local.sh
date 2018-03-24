TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore truffle:migrate
TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore test
TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore test:report
TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore build