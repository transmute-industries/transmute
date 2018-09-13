output "endpoint" {
  description = "Endpoint of the cluster."
  value       = "${aws_eks_cluster.cluster.endpoint}"
}

output "kubeconfig-certificate-authority-data" {
  description = "CA data for the cluster."
  value       = "${aws_eks_cluster.cluster.certificate_authority.0.data}"
}

output "cluster_id" {
  description = "The name of the cluster."
  value       = "${aws_eks_cluster.cluster.id}"
}
