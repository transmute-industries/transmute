#!/bin/sh
: ${TRANSMUTE_DIR:=$HOME/.transmute}
: ${TRANSMUTE_BIN:=$TRANSMUTE_DIR/bin}
: ${TRANSMUTE_REPO:=$TRANSMUTE_DIR/git/transmute}

kubectl create -f https://raw.githubusercontent.com/openebs/openebs/master/k8s/openebs-operator.yaml
kubectl create -f https://raw.githubusercontent.com/openebs/openebs/master/k8s/openebs-storageclasses.yaml
kubectl create -f $TRANSMUTE_REPO/components/ipfs/openebs-ipfs.yaml

# while loop
countone=1
# timeout for 15 minutes
while [ $countone -lt 151 ]
do
  echo -n '.'
  RESULT=$(kubectl get po --namespace=kube-system | grep openebs-provisioner | grep Running)
  if [ "$RESULT" ]; then
      echo '.'
      echo "$RESULT"
      break
  fi
  countone=`expr $countone + 1`
  sleep 3
done

echo "openebs is now up and running"
