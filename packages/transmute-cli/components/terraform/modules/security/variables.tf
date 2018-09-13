variable "vpc_id" {
  description = "ID of the VPC to deploy the cluster to."
  type        = "string"
}

variable "cluster_name" {
  description = "Name of the cluster. For tagging."
  type        = "string"
}
