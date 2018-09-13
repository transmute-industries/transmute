variable "policy_arn_eks_cluster" {
  description = "ARN of the default policy: AmazonEKSClusterPolicy."
  type        = "string"
}

variable "policy_arn_eks_service" {
  description = "ARN of the default policy: AmazonEKSServicePolicy."
  type        = "string"
}

variable "policy_arn_eks_worker" {
  description = "ARN of the default policy: AmazonEKSWorkerNodePolicy"
  type        = "string"
}

variable "policy_arn_eks_cni" {
  description = "ARN of the default policy: AmazonEKS_CNI_Policy"
  type        = "string"
}

variable "policy_arn_ecr_read" {
  description = "ARN of the default policy: AmazonEC2ContainerRegistryReadOnly"
  type        = "string"
}
