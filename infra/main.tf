terraform {
  required_version = ">= 1.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

variable "domain" {
  description = "Primary domain for the SalonX platform"
  type        = string
  default     = "salonx.com"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "vercel_team_id" {
  description = "Vercel team ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  type        = string
}

resource "vercel_project" "web" {
  name      = "salonx-web-${var.environment}"
  framework = "nextjs"
  
  git_repository = {
    type = "github"
    repo = "jh-salman/salonx-platform"
  }

  build_command    = "cd ../.. && pnpm build --filter=web"
  output_directory = "apps/web/.next"
  install_command  = "pnpm install"
  root_directory   = "apps/web"

  environment = [
    {
      key    = "NODE_ENV"
      value  = var.environment == "prod" ? "production" : var.environment
      target = ["production", "preview"]
    },
    {
      key    = "NEXT_PUBLIC_API_URL"
      value  = var.environment == "prod" ? "https://api.${var.domain}" : "https://api-${var.environment}.${var.domain}"
      target = ["production", "preview"]
    }
  ]
}

resource "cloudflare_record" "web" {
  zone_id = var.cloudflare_zone_id
  name    = var.environment == "prod" ? "@" : var.environment
  value   = "cname.vercel-dns.com"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = var.environment == "prod" ? "api" : "api-${var.environment}"
  value   = "your-railway-or-fly-domain.com" # Replace with actual deployment domain
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "wildcard" {
  zone_id = var.cloudflare_zone_id
  name    = var.environment == "prod" ? "*" : "*.${var.environment}"
  value   = "cname.vercel-dns.com"
  type    = "CNAME"
  proxied = true
}

resource "vercel_project_domain" "web_domain" {
  project_id = vercel_project.web.id
  domain     = var.environment == "prod" ? var.domain : "${var.environment}.${var.domain}"
}

resource "vercel_project_domain" "wildcard_domain" {
  project_id = vercel_project.web.id
  domain     = var.environment == "prod" ? "*.${var.domain}" : "*.${var.environment}.${var.domain}"
}

output "web_url" {
  value = "https://${var.environment == "prod" ? var.domain : "${var.environment}.${var.domain}"}"
}

output "api_url" {
  value = "https://${var.environment == "prod" ? "api" : "api-${var.environment}"}.${var.domain}"
}

output "vercel_project_id" {
  value = vercel_project.web.id
}
