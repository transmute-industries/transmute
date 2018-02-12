

export GANACHE_CLI=$(minikube --namespace transmute-testrpc  service transmute-testrpc-ganache-cli --url )
export IPFS_GATEWAY=$(minikube service --url ipfs-gateway --namespace transmute-ipfs)
export IPFS_API=$(minikube service --url ipfs-api --namespace transmute-ipfs)