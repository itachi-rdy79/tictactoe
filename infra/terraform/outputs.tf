output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.arcade_server.id
}

output "instance_public_ip" {
  description = "Public IPv4 address of the gaming hub server"
  value       = aws_instance.arcade_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.arcade_server.public_dns
}

output "application_url" {
  description = "Direct browser URL to play the Arcade Hub"
  value       = "http://${aws_instance.arcade_server.public_ip}"
}
