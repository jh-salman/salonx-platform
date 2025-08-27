output "environments" {
  description = "Environment configurations"
  value = {
    for env in var.environments : env => {
      web_url = "https://${env == "prod" ? var.domain : "${env}.${var.domain}"}"
      api_url = "https://${env == "prod" ? "api" : "api-${env}"}.${var.domain}"
    }
  }
}

output "deployment_commands" {
  description = "Commands for deploying to each environment"
  value = {
    web = "vercel --prod"
    api = "railway deploy"
    workers = "railway deploy"
  }
}
