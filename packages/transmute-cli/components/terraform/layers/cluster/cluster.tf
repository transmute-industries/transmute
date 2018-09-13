module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "1.34.0"

  name = "eks-cluster"
  cidr = "10.0.0.0/20"

  azs            = ["${var.availability_zones}"]
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]

  enable_nat_gateway = false
  enable_vpn_gateway = false

  tags = {
    Terraform   = "true"
    Environment = "${terraform.workspace}"

    # Mirror a tag that EKS will apply
    "kubernetes.io/cluster/eks-cluster" = "shared"
  }
}

module "iam" {
  source = "../../modules/iam"

  policy_arn_eks_cni     = "${var.policy_arn_eks_cni}"
  policy_arn_eks_service = "${var.policy_arn_eks_service}"
  policy_arn_ecr_read    = "${var.policy_arn_ecr_read}"
  policy_arn_eks_cluster = "${var.policy_arn_eks_cluster}"
  policy_arn_eks_worker  = "${var.policy_arn_eks_worker}"
}

module "security" {
  source       = "../../modules/security"
  vpc_id       = "${module.vpc.vpc_id}"
  cluster_name = "${var.cluster_name}"
}

module "eks_masters" {
  source = "../../modules/eks-masters"

  cluster_name = "${var.cluster_name}"

  role_arn = "${module.iam.role_arn_eks_basic_masters}"

  cluster_subnets = "${module.vpc.public_subnets}"

  sg_id_cluster = "${module.security.sg_id_masters}"
}

module "eks_workers" {
  source = "../../modules/eks-workers"

  # Use module output to wait for masters to create.
  cluster_name = "${module.eks_masters.cluster_id}"

  instance_profile_name_workers = "${module.iam.instance_profile_name_workers}"

  worker_subnets = "${module.vpc.public_subnets}"
  sg_id_workers  = "${module.security.sg_id_workers}"
}
