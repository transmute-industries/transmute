output "sg_id_masters" {
  description = "ID of the security group for the EKS cluster."
  value       = "${aws_security_group.masters.id}"
}

output "sg_id_workers" {
  description = "ID of the security group for the works ASG."
  value       = "${aws_security_group.workers.id}"
}
