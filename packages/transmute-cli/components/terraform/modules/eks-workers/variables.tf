variable "worker_subnets" {
  description = "Subnets to deploy the workers in to."
  type        = "list"
}

variable "cluster_name" {
  description = "Name of the cluster to add the workers to."
  type        = "string"
}

variable "sg_id_workers" {
  description = "Security group ID for the workers."
  type        = "string"
}

variable "instance_profile_name_workers" {
  description = "Name of the workers instance profile"
  type        = "string"
}
