output "vpc_id" {
  description = "ID of the VPC"
  value       = "${module.vpc.vpc_id}"
}

output "endpoint" {
  description = "Endpoint of the cluster."
  value       = "${module.eks_masters.endpoint}"
}

output "cluster_id" {
  description = "The name of the cluster."
  value       = "${module.eks_masters.cluster_id}"
}

### kubecfg
locals {
  kubeconfig-aws-1-10 = <<KUBECONFIG
---
apiVersion: v1
clusters:
- cluster:
    server: ${module.eks_masters.endpoint}
    certificate-authority-data: ${module.eks_masters.kubeconfig-certificate-authority-data}
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: aws
  name: aws
current-context: aws
kind: Config
preferences: {}
users:
- name: aws
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      command: heptio-authenticator-aws
      args:
        - "token"
        - "-i"
        - "${module.eks_masters.cluster_id}"

KUBECONFIG
}

output "kubeconfig-aws-1-10" {
  description = "Kubeconfig to connect to the cluster."
  value       = "${local.kubeconfig-aws-1-10}"
}

output "role_arn_basic_workers" {
  description = "ARN of the IAM role used by worker nodes."
  value       = "${module.iam.role_arn_eks_basic_workers}"
}

### kubecfg
locals {
  auth_config_map = <<EOF
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: ${module.iam.role_arn_eks_basic_workers}
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes

EOF
}

output "auth_config_map" {
  description = "Config map file to apply to cluster on creation."
  value       = "${local.auth_config_map}"
}
