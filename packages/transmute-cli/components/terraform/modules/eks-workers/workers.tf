### Hardcoding a lot of values for now.

resource "aws_autoscaling_group" "eks_workers" {
  name = "eks-workers"

  launch_configuration = "${aws_launch_configuration.eks_workers.name}"

  default_cooldown = 10

  desired_capacity = 1
  max_size         = 2
  min_size         = 1

  vpc_zone_identifier = ["${var.worker_subnets}"]

  tag {
    key   = "Name"
    value = "${var.cluster_name}-worker"

    propagate_at_launch = true
  }

  tag {
    key   = "kubernetes.io/cluster/${var.cluster_name}"
    value = "owned"

    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_launch_configuration" "eks_workers" {
  instance_type = "t2.medium"
  image_id      = "ami-dea4d5a1"

  security_groups = ["${var.sg_id_workers}"]

  # No ssh for now. Shouldn't be necessary
  # key_name = ""

  iam_instance_profile        = "${var.instance_profile_name_workers}"
  associate_public_ip_address = true
  user_data                   = "${data.template_file.user_data.rendered}"
  lifecycle {
    create_before_destroy = true
  }
}

data "template_file" "user_data" {
  template = "${file("${path.module}/user-data.tpl")}"

  vars {
    aws_region   = "${var.aws_region}"
    cluster_name = "${var.cluster_name}"

    # Hardcoded to 17 which is the max for t2.medium
    max_pods = 17
  }
}
