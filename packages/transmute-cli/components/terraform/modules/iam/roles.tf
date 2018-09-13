### Masters
resource "aws_iam_role" "eks_basic_masters" {
  description = "The minimum permissions for a functioning eks cluster."

  name               = "eks-basic-access-masters"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy_eks.json}"
}

resource "aws_iam_role_policy_attachment" "eks_masters_cluster" {
  role       = "${aws_iam_role.eks_basic_masters.name}"
  policy_arn = "${var.policy_arn_eks_cluster}"
}

resource "aws_iam_role_policy_attachment" "eks_masters_service" {
  role       = "${aws_iam_role.eks_basic_masters.name}"
  policy_arn = "${var.policy_arn_eks_service}"
}

### Workers
resource "aws_iam_instance_profile" "eks_basic_workers" {
  name = "eks-basic-access-workers"

  role = "${aws_iam_role.eks_basic_workers.name}"
}

resource "aws_iam_role" "eks_basic_workers" {
  description = "The minimum permissions for functioning worker nodes."

  name               = "eks-basic-access-workers"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy_ec2.json}"
}

resource "aws_iam_role_policy_attachment" "eks_workers_worker" {
  role       = "${aws_iam_role.eks_basic_workers.name}"
  policy_arn = "${var.policy_arn_eks_worker}"
}

resource "aws_iam_role_policy_attachment" "eks_workers_cni" {
  role       = "${aws_iam_role.eks_basic_workers.name}"
  policy_arn = "${var.policy_arn_eks_cni}"
}

resource "aws_iam_role_policy_attachment" "eks_workers_ecr" {
  role       = "${aws_iam_role.eks_basic_workers.name}"
  policy_arn = "${var.policy_arn_ecr_read}"
}
