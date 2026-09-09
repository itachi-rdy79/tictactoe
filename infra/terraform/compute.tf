# Query latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Free Tier EC2 instance
resource "aws_instance" "arcade_server" {
  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = var.instance_type
  vpc_security_group_ids      = [aws_security_group.arcade_sg.id]
  subnet_id                   = element(data.aws_subnets.default.ids, 0)
  associate_public_ip_address = true

  root_block_device {
    volume_size           = 20 # 30 GB free tier eligible
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system packages
              dnf update -y

              # Install Docker
              dnf install -y docker
              systemctl enable --now docker

              # Add ec2-user to docker group
              usermod -aG docker ec2-user

              # Pull and run GAP Arcade Container from GHCR
              # Note: If repository is private, authenticate with docker login first
              docker run -d \
                --name gap-arcade \
                --restart always \
                -p 80:8080 \
                ${var.ghcr_image}

              echo "GAP Arcade Gaming Hub successfully deployed and listening on port 80" > /var/log/arcade-bootstrap.log
              EOF

  tags = {
    Name = "gap-arcade-server-${var.environment}"
  }
}
