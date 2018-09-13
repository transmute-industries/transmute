provider "aws" {
  version = "~> 1.17"
  region  = "${var.aws_region}"
  access_key = "${var.aws_key}"
  secret_key = "${var.aws_secret}"
}

terraform {
  backend "s3" {}
}

data "terraform_remote_state" "state" {
  backend = "s3"
  config {
    bucket =  "terraform.${var.cluster_name}"
    key    = "${var.cluster_name}.tfstate"
    region = "${var.aws_region}"
    access_key = "${var.aws_key}"
    secret_key = "${var.aws_secret}"
  }
}
