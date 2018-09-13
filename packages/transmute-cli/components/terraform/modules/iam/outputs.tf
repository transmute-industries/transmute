output "role_arn_eks_basic_masters" {
  description = "ARN of the eks-basic-masters role."
  value       = "${aws_iam_role.eks_basic_masters.arn}"
}

output "role_arn_eks_basic_workers" {
  description = "ARN of the eks-basic-workers role."
  value       = "${aws_iam_role.eks_basic_workers.arn}"
}

output "instance_profile_name_workers" {
  description = "Name of the workers instance profile"
  value       = "${aws_iam_instance_profile.eks_basic_workers.name}"
}
