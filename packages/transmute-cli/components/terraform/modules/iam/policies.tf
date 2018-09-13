data "aws_iam_policy_document" "assume_role_policy_eks" {
  statement = {
    actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type = "Service"

      identifiers = ["eks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "assume_role_policy_ec2" {
  statement = {
    actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type = "Service"

      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
