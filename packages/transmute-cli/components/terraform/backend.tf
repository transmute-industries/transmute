terraform {
  backend "s3" {
    bucket = "terraform.${var.cluster-name}"
    key    = "terraform.tfstate"
    region = "${var.region}"
    access_key = "${var.aws_key}"
    secret_key = "${var.aws_secret}"
  }
}
