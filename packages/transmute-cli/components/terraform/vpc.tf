#
# VPC Resources
#  * VPC
#  * Subnets
#  * Internet Gateway
#  * Route Table
#

resource "aws_vpc" "transmute" {
  cidr_block = "10.0.0.0/16"

  tags = "${
    map(
     "Name", "terraform-eks-transmute-node",
     "kubernetes.io/cluster/${var.cluster-name}", "shared",
    )
  }"
}

resource "aws_subnet" "transmute" {
  count = 2

  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  cidr_block        = "10.0.${count.index}.0/24"
  vpc_id            = "${aws_vpc.transmute.id}"

  tags = "${
    map(
     "Name", "terraform-eks-transmute-node",
     "kubernetes.io/cluster/${var.cluster-name}", "shared",
    )
  }"
}

resource "aws_internet_gateway" "transmute" {
  vpc_id = "${aws_vpc.transmute.id}"

  tags {
    Name = "terraform-eks-transmute"
  }
}

resource "aws_route_table" "transmute" {
  vpc_id = "${aws_vpc.transmute.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.transmute.id}"
  }
}

resource "aws_route_table_association" "transmute" {
  count = 2

  subnet_id      = "${aws_subnet.transmute.*.id[count.index]}"
  route_table_id = "${aws_route_table.transmute.id}"
}
