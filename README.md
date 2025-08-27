# SalonX Platform

A production-grade, multi-tenant salon management platform built with modern technologies and best practices.

## 🏗️ Architecture

This is a Turborepo monorepo containing:

- **apps/web** - Next.js frontend with App Router, Tailwind CSS, and shadcn/ui
- **apps/api** - Express.js backend with TypeScript, Zod validation, and OpenAPI
- **apps/mobile** - Expo React Native app for stylists
- **apps/workers** - Background job processors with BullMQ
- **packages/db** - Drizzle ORM schema and migrations
- **packages/sdk** - Generated TypeScript SDK for API consumption
- **packages/ui** - Shared UI components
- **packages/config** - Shared configuration and constants

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis instance
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jh-salman/salonx-platform.git
cd salonx-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

5. Start development servers:
```bash
# Start all services
pnpm dev

# Or start individual services
pnpm dev:web     # Next.js frontend (http://localhost:3000)
pnpm dev:api     # Express API (http://localhost:3001)
pnpm dev:mobile  # Expo mobile app
pnpm dev:workers # Background workers
```

## 📱 Core Features

### Public Booking Flow
- Guest booking on brand subdomains (e.g., `salman.salonx.com`)
- Service selection and availability checking
- Stripe Checkout integration for deposits
- Automated confirmation and reminders

### Pro Dashboard
- **Owner/Member RBAC** - Role-based access control
- **Calendar Management** - View, park, return, cancel, reschedule appointments
- **Service Management** - CRUD operations for services and pricing
- **Client Management** - Customer database with notes and history
- **Reports & Analytics** - Revenue, completion rates, CSV exports

### Marketing Tools
- **Website Builder** - Publish brand websites with SEO optimization
- **Email Campaigns** - Template-based campaigns with analytics
- **SMS Campaigns** - 10DLC compliant messaging with opt-in/out

### Mobile App (Expo)
- Stylist authentication and profile management
- Today's schedule and appointment details
- Check-in, mark paid, reschedule actions
- Push notifications for updates

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** + **shadcn/ui** for styling
- **TanStack Query** for data fetching
- **Zustand** for state management

### Backend
- **Express.js** with TypeScript and Zod validation
- **Drizzle ORM** with PostgreSQL
- **OpenAPI 3.1** specification with generated SDK
- **BullMQ** for job queues with Redis

### Mobile
- **Expo Router** for navigation
- **React Native** with TypeScript
- **NativeWind** for styling
- **Expo Notifications** for push notifications

### Infrastructure
- **Multi-tenant** architecture with org/brand scoping
- **OpenTelemetry** + **Prometheus** + **Sentry** observability
- **Stripe** for PCI-compliant payments
- **Terraform** infrastructure as code

## 🔒 Security & Compliance

### Data Protection
- **PII encryption** at rest with key rotation
- **Multi-tenant isolation** with hard guards
- **GDPR compliance** with export/delete endpoints

### Payment Security
- **Stripe Checkout** (hosted, PCI compliant)
- **No card data storage** on our servers
- **Idempotent webhooks** with signature verification

### Communication Compliance
- **Email**: List-Unsubscribe headers, double opt-in
- **SMS**: 10DLC rules, explicit opt-in, STOP/START/HELP, quiet hours (8 PM - 8 AM)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Load testing
pnpm test:load
```

## 📊 Monitoring & Observability

### Metrics & Tracing
- **OpenTelemetry** distributed tracing
- **Prometheus** metrics collection
- **Sentry** error tracking and performance monitoring

### Health Checks
- API health endpoint: `GET /health`
- Database connectivity checks
- Redis connectivity checks

### Performance Targets
- **p95 < 300ms** for cached GET requests
- **99.9% uptime** SLA for web/API
- **Lighthouse ≥ 90** for performance/SEO/A11y

## 🚀 Deployment

### Development
```bash
pnpm dev
```

### Staging
```bash
pnpm build
pnpm start:staging
```

### Production
```bash
# Build all apps
pnpm build

# Deploy web (Vercel)
pnpm deploy:web

# Deploy API (Railway/Fly.io)
pnpm deploy:api

# Deploy workers
pnpm deploy:workers
```

### Infrastructure
```bash
cd infra/
terraform init
terraform plan
terraform apply
```

## 📝 API Documentation

The API documentation is automatically generated from the OpenAPI specification:

- **Development**: http://localhost:3001/docs
- **Staging**: https://api-staging.salonx.com/docs
- **Production**: https://api.salonx.com/docs

## 🔧 Development Workflow

### Database Migrations
```bash
# Generate migration
pnpm db:generate

# Run migrations
pnpm db:migrate

# Reset database (development only)
pnpm db:reset
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push and create PR: `git push origin feature/your-feature`
4. Wait for CI/CD checks to pass
5. Merge after review

## 🆘 Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify connection string in .env
echo $DATABASE_URL
```

**Redis connection errors:**
```bash
# Check Redis is running
redis-cli ping

# Verify Redis URL in .env
echo $REDIS_URL
```

**Build errors:**
```bash
# Clear all node_modules and reinstall
pnpm clean
pnpm install

# Clear Turbo cache
pnpm turbo clean
```

### Performance Issues

**Slow API responses:**
- Check database query performance with `EXPLAIN ANALYZE`
- Monitor Redis cache hit rates
- Review OpenTelemetry traces in your observability platform

**High memory usage:**
- Monitor Node.js heap usage
- Check for memory leaks in long-running processes
- Review BullMQ job concurrency settings

## 📞 Support

For technical support or questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue with detailed reproduction steps
- **Security**: Email security@salonx.com for security-related issues

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ by the SalonX team
