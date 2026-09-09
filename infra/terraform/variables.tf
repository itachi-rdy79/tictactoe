variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type (Free tier eligible: t2.micro or t3.micro)"
  type        = string
  default     = "t2.micro"
}

variable "ghcr_image" {
  description = "Container image URI hosted on GitHub Container Registry"
  type        = string
  default     = "ghcr.io/your-github-username/tictactoe:latest"
}

variable "app_port" {
  description = "External port to expose the game"
  type        = number
  default     = 80
}
