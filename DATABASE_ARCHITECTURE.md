# SalonX Platform - Database Architecture & Features

## 🏗️ **Enterprise-Grade Database Architecture**

SalonX is built on a robust, scalable PostgreSQL database architecture designed for multi-tenant salon management operations. Our database schema supports complex business workflows while maintaining high performance and data integrity.

---

## 📊 **Database Overview**

- **Database Engine**: PostgreSQL (Supabase/Neon compatible)
- **ORM**: Drizzle ORM with TypeScript
- **Multi-Tenancy**: Organization-based with brand-level isolation
- **Migration Strategy**: Expand-contract pattern for zero-downtime deployments
- **Backup Strategy**: Point-in-time recovery with automated snapshots

---

## 🗂️ **Complete Database Schema (14+ Tables)**

### **1. Core Business Tables**

#### **`orgs` - Organization Management**
```sql
- id: UUID (Primary Key)
- name: Organization name
- slug: URL-friendly identifier
- ownerId: Reference to owner profile
- isActive: Soft delete flag
- createdAt, updatedAt: Audit timestamps
```
**Business Value**: Enables multi-tenant SaaS architecture, allowing multiple salon chains under one platform.

#### **`brands` - Individual Salon Locations**
```sql
- id: UUID (Primary Key)
- orgId: Foreign Key to orgs
- name: Salon brand name
- slug: Subdomain identifier (e.g., salman.salonx.com)
- timezone: Local timezone for scheduling
- depositPercentage: Configurable deposit requirements
- theme: JSON (colors, logo, branding)
- contactEmail, contactPhone: Business contact info
- address: JSON (structured address data)
- businessHours: JSON (flexible scheduling rules)
- cancellationPolicy: Custom policy text
```
**Business Value**: Complete brand customization, subdomain routing, flexible scheduling, and policy management.

#### **`services` - Service Catalog**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- name: Service name
- description: Service details
- durationMinutes: Service duration
- priceInCents: Pricing in cents (no floating point issues)
- depositInCents: Required deposit amount
- category: Service categorization
- isActive: Enable/disable services
```
**Business Value**: Flexible pricing, deposit management, service categorization, and inventory control.

#### **`clients` - Customer Database**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- firstName, lastName: Customer names
- email: Contact email (encrypted at rest)
- phone: Contact phone (encrypted at rest)
- notes: Customer preferences and history
- createdAt, updatedAt: Customer lifecycle tracking
```
**Business Value**: Comprehensive customer relationship management with PII encryption compliance.

#### **`appointments` - Booking System**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- clientId: Foreign Key to clients
- serviceId: Foreign Key to services
- stylistId: Foreign Key to stylists
- startAt: Appointment start time
- endAt: Calculated end time
- status: PENDING | CONFIRMED | PARKED | CANCELLED | COMPLETED
- paymentStatus: UNPAID | PAID | REFUNDED
- stripePaymentIntentId: Payment tracking
- totalAmountInCents: Total booking amount
- depositAmountInCents: Deposit paid
- notes: Appointment-specific notes
```
**Business Value**: Complete appointment lifecycle management with payment integration and flexible status tracking.

### **2. Staff Management**

#### **`profiles` - User Management**
```sql
- id: UUID (Primary Key)
- userId: Authentication system reference
- orgId: Foreign Key to orgs
- role: owner | member (RBAC)
- firstName, lastName: User names
- email: User email
- isActive: Account status
```

#### **`stylists` - Staff Directory**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- profileId: Optional link to user profiles
- name: Stylist name
- email: Contact email
- phone: Contact phone
- specialties: JSON array of specializations
- bio: Professional biography
- isActive: Employment status
```
**Business Value**: Complete staff management with specialization tracking and flexible employment status.

### **3. Marketing & Website Suite**

#### **`websiteSettings` - Website Builder**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- isPublished: Website publication status
- seoTitle, seoDescription: SEO optimization
- heroTitle, heroSubtitle: Homepage content
- aboutText: About section content
- socialLinks: JSON (social media links)
- customCss, customJs: Advanced customization
- googleAnalyticsId: Analytics integration
```
**Business Value**: Complete website builder with SEO optimization and analytics integration.

#### **`emailTemplates` - Email Marketing Templates**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- name: Template name
- subject: Email subject line
- htmlContent: Rich email content
- isDefault: Default template flag
```

#### **`emailLists` & `emailSubscribers` - Email Marketing**
```sql
EmailLists:
- id, brandId, name, description, subscriberCount

EmailSubscribers:
- id, listId, email, firstName, lastName
- isActive: Subscription status
- unsubscribeToken: Compliance token
- optInAt: Double opt-in timestamp
```
**Business Value**: GDPR-compliant email marketing with double opt-in and unsubscribe management.

#### **`emailCampaigns` - Campaign Management**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- listId: Target email list
- name: Campaign name
- subject: Email subject
- htmlContent: Campaign content
- status: DRAFT | SCHEDULED | SENDING | SENT | CANCELLED
- scheduledAt: Send scheduling
- recipientCount, openCount, clickCount: Analytics
```
**Business Value**: Complete email marketing automation with detailed analytics and scheduling.

#### **`smsSubscribers` & `smsCampaigns` - SMS Marketing**
```sql
SMS Subscribers:
- phone, isActive, optInAt, optOutAt
- Compliance tracking for 10DLC regulations

SMS Campaigns:
- message (160 char limit), deliveryCount, failureCount
- Quiet hours compliance (8am-8pm local time)
```
**Business Value**: SMS marketing with full compliance (STOP/START/HELP, quiet hours, 10DLC).

#### **`shortLinks` - Link Tracking**
```sql
- id: UUID (Primary Key)
- brandId: Foreign Key to brands
- originalUrl: Target URL
- shortCode: Shortened identifier
- clickCount: Analytics tracking
```
**Business Value**: Marketing campaign tracking and analytics.

### **4. System & Compliance**

#### **`audit_logs` - Compliance & Security**
```sql
- id: UUID (Primary Key)
- userId: User performing action
- orgId: Organization context
- action: Action performed
- resourceType: Type of resource affected
- resourceId: Specific resource ID
- metadata: JSON (additional context)
- ipAddress: Security tracking
- userAgent: Client information
- createdAt: Timestamp
```
**Business Value**: Complete audit trail for compliance, security monitoring, and debugging.

---

## 🔐 **Security & Multi-Tenancy Architecture**

### **Current Implementation**
- **Application-Level Multi-Tenancy**: All queries scoped by `orgId`/`brandId`
- **Hard Guards**: Middleware enforces tenant isolation
- **PII Encryption**: Phone and email fields encrypted at rest
- **JWT Authentication**: Secure token-based authentication
- **Audit Logging**: Complete action tracking for compliance

### **Recommended Enhancements (RLS Policies)**
```sql
-- Example RLS Policy for Brands Table
CREATE POLICY "Users can only access their org's brands" 
ON brands FOR ALL 
USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- Example RLS Policy for Appointments
CREATE POLICY "Brand isolation for appointments" 
ON appointments FOR ALL 
USING (brand_id IN (
  SELECT id FROM brands 
  WHERE org_id = (auth.jwt() ->> 'org_id')::uuid
));
```

**Business Value**: Database-level security provides additional protection against application bugs and ensures data isolation even with direct database access.

---

## 🚀 **Performance & Scalability Features**

### **Database Optimizations**
- **Indexed Foreign Keys**: Fast relationship queries
- **UUID Primary Keys**: Distributed system compatibility
- **JSON Fields**: Flexible schema evolution
- **Timestamp Tracking**: Complete audit trail
- **Soft Deletes**: Data recovery capabilities

### **Query Performance**
- **Efficient Joins**: Optimized relationship queries
- **Pagination Support**: Cursor-based pagination ready
- **Filtering & Sorting**: Indexed common query patterns
- **Caching Strategy**: Redis integration for frequent queries

---

## 📈 **Business Intelligence & Analytics**

### **Built-in Analytics Tables**
- **Campaign Performance**: Email/SMS open rates, click tracking
- **Appointment Metrics**: Booking patterns, cancellation rates
- **Revenue Tracking**: Payment status, deposit management
- **Customer Insights**: Client history, preferences, lifetime value

### **Reporting Capabilities**
- **Real-time Dashboards**: Live appointment and revenue data
- **Historical Analysis**: Trend analysis and growth metrics
- **Export Functions**: CSV exports for external analysis
- **Custom Reports**: Flexible query capabilities

---

## 🔄 **Data Migration & Backup Strategy**

### **Migration Management**
- **Expand-Contract Pattern**: Zero-downtime schema changes
- **Version Control**: All migrations tracked in Git
- **Rollback Capability**: Safe deployment practices
- **Data Seeding**: Consistent development environments

### **Backup & Recovery**
- **Point-in-Time Recovery**: PostgreSQL PITR support
- **Automated Snapshots**: Nightly backup automation
- **Cross-Region Replication**: Disaster recovery ready
- **Data Export**: Complete data portability

---

## 🌐 **Integration Capabilities**

### **Payment Integration**
- **Stripe Integration**: Complete payment lifecycle
- **Webhook Handling**: Idempotent payment processing
- **Refund Management**: Automated refund processing
- **Deposit Tracking**: Flexible deposit requirements

### **Communication Integration**
- **Email Providers**: Postmark/SendGrid support
- **SMS Providers**: Twilio integration with compliance
- **Notification System**: Real-time updates via WebSocket
- **Calendar Integration**: iCal/Google Calendar sync ready

---

## 📋 **Compliance & Standards**

### **Data Protection**
- **GDPR Compliance**: Data export/deletion endpoints
- **PII Encryption**: Sensitive data encrypted at rest
- **Audit Trails**: Complete action logging
- **Data Minimization**: Only necessary data collected

### **Industry Standards**
- **PCI Compliance**: No card data stored (Stripe hosted)
- **HIPAA Ready**: Audit logging and encryption
- **SOC 2 Ready**: Security controls implemented
- **10DLC Compliance**: SMS marketing regulations

---

## 🎯 **Competitive Advantages**

### **vs. GlossGenius**
✅ **Superior Marketing Suite**: Email/SMS campaigns + website builder  
✅ **Better Multi-Tenancy**: Org → Brand hierarchy  
✅ **Advanced Appointment Management**: PARKED status for flexibility  
✅ **Comprehensive Analytics**: Built-in reporting and tracking  
✅ **Modern Architecture**: TypeScript, Drizzle ORM, JSON flexibility  

### **vs. Square Appointments**
✅ **Custom Branding**: Complete white-label solution  
✅ **Marketing Automation**: Built-in email/SMS campaigns  
✅ **Multi-Location**: Organization-level management  
✅ **Developer-Friendly**: Modern API and webhook system  

### **vs. Fresha**
✅ **Data Ownership**: Complete control over customer data  
✅ **Customization**: Flexible schema and business rules  
✅ **Integration Ready**: Modern API architecture  
✅ **Compliance Built-in**: GDPR, PCI, audit logging  

---

## 💼 **Business Value Summary**

### **For Salon Owners**
- Complete business management in one platform
- Professional online presence with booking
- Automated marketing campaigns
- Detailed analytics and reporting
- Multi-location support

### **For Developers/Integrators**
- Modern TypeScript architecture
- Comprehensive API coverage
- Webhook system for real-time updates
- Flexible schema for customization
- Complete documentation and type safety

### **For Enterprise Buyers**
- Scalable multi-tenant architecture
- Enterprise security and compliance
- Professional support and documentation
- Modern technology stack
- Competitive feature set

---

**SalonX Database Architecture represents a modern, scalable, and feature-complete solution for salon management software, designed to compete with and exceed industry leaders like GlossGenius, Square, and Fresha.**
