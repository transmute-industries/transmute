#
# Variables Configuration
#

variable "cluster-name" {
  default = "transmute"
  type    = "string"
}

variable "region" {
  default = "us-west-2"
  type    = "string"
}

variable "aws_key" {
  type    = "string"
}
variable "aws_secret" {
  type    = "string"
}