all: build

build:
	npm run build

ig:
	npm i -g

i:
	npm i

test: build
	-@minikube delete
	transmute test
	transmute k8s provision --minikube
	transmute k8s init --minikube
