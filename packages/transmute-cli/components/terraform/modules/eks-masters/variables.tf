variable "role_arn" {
  description = "ARN of the IAM role to use for the cluster."
  type        = "string"
}

variable "cluster_subnets" {
  description = "Subnets to deploy the cluster in to."
  type        = "list"
}

variable "cluster_name" {
  description = "Name of the cluster"
  type        = "string"
}

variable "sg_id_cluster" {
  description = "ID of the security group to attach to the cluster."
  type        = "string"
}
