resource "aws_eks_cluster" "cluster" {
  name     = "${var.cluster_name}"
  role_arn = "${var.role_arn}"

  vpc_config {
    subnet_ids = ["${var.cluster_subnets}"]

    security_group_ids = [
      "${var.sg_id_cluster}",
    ]
  }
}
