# SalonX Infrastructure

This directory contains Terraform configurations for deploying the SalonX platform infrastructure.

## Prerequisites

- Terraform >= 1.0
- Vercel CLI and account
- Cloudflare account with domain management
- Railway or Fly.io account for API/workers deployment

## Setup

1. Install Terraform and required providers:
```bash
terraform init
```

2. Configure environment variables:
```bash
export VERCEL_API_TOKEN="your-vercel-token"
export CLOUDFLARE_API_TOKEN="your-cloudflare-token"
export TF_VAR_vercel_team_id="your-vercel-team-id"
export TF_VAR_cloudflare_zone_id="your-cloudflare-zone-id"
```

3. Plan the deployment:
```bash
terraform plan -var="environment=prod"
```

4. Apply the configuration:
```bash
terraform apply -var="environment=prod"
```

## Environments

The infrastructure supports multiple environments:

- **dev** - Development environment
- **staging** - Staging environment for testing
- **prod** - Production environment

Each environment gets its own:
- Subdomain (e.g., staging.salonx.com)
- API subdomain (e.g., api-staging.salonx.com)
- Wildcard subdomain for brands (e.g., *.staging.salonx.com)

## DNS Configuration

The Terraform configuration sets up:

- **Root domain** - Points to Vercel for the main web app
- **API subdomain** - Points to Railway/Fly.io for the API
- **Wildcard subdomain** - Points to Vercel for brand sites

## Deployment Workflow

1. **Web App (Vercel)**:
   - Automatically deploys from GitHub on push to main
   - Preview deployments for pull requests
   - Edge caching and CDN

2. **API & Workers (Railway/Fly.io)**:
   - Deploy using Railway CLI or Fly CLI
   - Blue/green deployment strategy
   - Health checks and rollback capabilities

3. **Database & Redis**:
   - Managed services (Supabase, Upstash, or AWS)
   - Automated backups and monitoring
   - Connection pooling and read replicas

## Security

- All traffic routed through Cloudflare for DDoS protection
- SSL/TLS certificates automatically managed
- WAF rules for common attack patterns
- Rate limiting at the edge

## Monitoring

- Cloudflare Analytics for traffic insights
- Vercel Analytics for web performance
- Custom dashboards for API metrics
- Alerting for downtime and errors

## Backup & Recovery

- Database automated backups with point-in-time recovery
- Redis persistence and snapshots
- Application code in version control
- Infrastructure as code for reproducibility

## Cost Optimization

- Vercel: Pay-per-use with generous free tier
- Railway/Fly.io: Resource-based pricing
- Cloudflare: Free tier covers most needs
- Database: Right-sized instances per environment
