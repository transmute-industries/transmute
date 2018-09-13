resource "aws_security_group" "masters" {
  name        = "${var.cluster_name}-masters"
  description = "Security group for the EKS cluster."

  vpc_id = "${var.vpc_id}"
}

resource "aws_security_group" "workers" {
  name        = "${var.cluster_name}-workers"
  description = "Security group for the EKS workers."

  vpc_id = "${var.vpc_id}"
}

### SG Rules HTTPS worker to master
resource "aws_security_group_rule" "in_worker_to_master_https" {
  description = "HTTPS communation from the worker nodes."

  type = "ingress"

  from_port = 443
  to_port   = 443

  protocol = "tcp"

  security_group_id        = "${aws_security_group.masters.id}"
  source_security_group_id = "${aws_security_group.workers.id}"
}

resource "aws_security_group_rule" "out_worker_to_all" {
  description = "Worker nodes can talk to anything."

  type = "egress"

  from_port = 0
  to_port   = 0

  protocol = "-1"

  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.workers.id}"
}

### SG Rules All TCP master to worker
resource "aws_security_group_rule" "in_master_to_worker_all_tcp" {
  description = "TCP communication from master nodes."

  type      = "ingress"
  from_port = 1025
  to_port   = 65535

  protocol = "tcp"

  security_group_id        = "${aws_security_group.workers.id}"
  source_security_group_id = "${aws_security_group.masters.id}"
}

resource "aws_security_group_rule" "out_master_to_worker_all_tcp" {
  description = "TCP communication to worker nodes."

  type      = "egress"
  from_port = 1025
  to_port   = 65535

  protocol = "tcp"

  security_group_id        = "${aws_security_group.masters.id}"
  source_security_group_id = "${aws_security_group.workers.id}"
}

### SG Rules All worker to worker
resource "aws_security_group_rule" "in_worker_to_worker_all" {
  description = "All communication in from other worker nodes."

  type      = "ingress"
  from_port = 0
  to_port   = 0

  protocol = "-1"

  security_group_id        = "${aws_security_group.workers.id}"
  source_security_group_id = "${aws_security_group.workers.id}"
}

#### ssh all to worker
#resource "aws_security_group_rule" "in_all_to_worker_ssh" {
#  description = "ssh in from anywhere."
#
#  type      = "ingress"
#  from_port = 22
#  to_port   = 22
#
#  protocol = "tcp"
#
#  cidr_blocks = ["0.0.0.0/0"]
#
#  security_group_id = "${aws_security_group.workers.id}"
#}

