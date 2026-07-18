# Environments

**File:** `docs/devops/02-environments.md`

---

# Purpose

This document defines the environments used throughout the software development lifecycle.

Each environment serves a specific purpose and is isolated from the others to ensure safe development, testing, and deployment.

---

# Objectives

- Isolate Development From Production
- Prevent Accidental Data Loss
- Enable Safe Testing
- Simplify Deployment
- Protect Customer Data
- Support Continuous Delivery

---

# Environment Overview

| Environment | Purpose | Public Access |
|-------------|----------|---------------|
| Local | Developer Machine | No |
| Development | Shared Development | Limited |
| Staging | QA & UAT | Limited |
| Production | Live Customers | Yes |

---

# Environment Flow

```
Local

↓

Development

↓

Staging

↓

Production
```

Code must always move in this direction.

Never deploy directly from Local to Production.

---

# Local Environment

Purpose

- Feature Development
- Debugging
- Unit Testing
- Component Development

---

## Infrastructure

Frontend

```
localhost:5173
```

Backend

```
Supabase Development Project
```

---

## Requirements

- Node.js LTS
- npm
- Git
- VS Code
- Environment Variables

---

## Local Data

Use

- Seed Data
- Fake Customers
- Dummy Orders
- Test Images

Never

Use Production Data.

---

# Development Environment

Purpose

- Shared Development
- Feature Integration
- API Integration
- Early Testing

---

## Characteristics

- Shared By Developers
- Frequently Updated
- May Be Unstable
- Connected To Development Database

---

## Data

Contains

- Sample Products
- Test Users
- Test Orders

No Real Customer Data.

---

# Staging Environment

Purpose

Production Simulation

Used For

- QA
- User Acceptance Testing
- Performance Validation
- Security Validation
- Release Approval

---

## Characteristics

Must Match Production

Including

- Configuration
- Database Schema
- Storage Policies
- Authentication
- Build Settings

---

## Deployment

Only Release Candidates

May Be Deployed Here.

---

## Data

Recommended

- Sanitized Production-Like Data
- Large Product Catalog
- Realistic Orders

Never

Use Sensitive Customer Information.

---

# Production Environment

Purpose

Serve Real Customers.

Characteristics

- Highly Available
- Monitored
- Secure
- Backed Up
- Stable

---

# Environment Isolation

Each Environment Must Have

- Separate Database
- Separate Storage
- Separate Authentication
- Separate Secrets
- Separate Logs
- Separate Monitoring

Never Share

Production Credentials.

---

# Environment Variables

Each Environment Maintains Independent Configuration.

Example

| Variable | Local | Dev | Staging | Production |
|----------|-------|-----|----------|------------|
| VITE_API_URL | ✓ | ✓ | ✓ | ✓ |
| VITE_SUPABASE_URL | ✓ | ✓ | ✓ | ✓ |
| VITE_SUPABASE_ANON_KEY | ✓ | ✓ | ✓ | ✓ |

---

# Secret Management

Secrets Must Never Be

- Hardcoded
- Committed To Git
- Shared Through Chat
- Stored Inside Source Files

Use

- GitHub Secrets
- Vercel Environment Variables
- Supabase Secrets

---

# Database Management

Each Environment Owns

- Database
- Migrations
- Storage
- Authentication

Migration Flow

```
Local

↓

Development

↓

Staging

↓

Production
```

---

# Storage Buckets

Separate Buckets Recommended

Example

Development

```
product-images-dev
payment-receipts-dev
```

Production

```
product-images
payment-receipts
```

---

# Authentication

Each Environment Uses

Independent

- JWT Configuration
- OAuth Providers
- Redirect URLs
- Email Templates

---

# Logging

Logs Must Never Mix Between Environments.

Each Environment Has

- Application Logs
- Database Logs
- Authentication Logs
- Deployment Logs

---

# Monitoring

Production

Full Monitoring

Development

Basic Monitoring

Local

Developer Debugging

---

# Performance Expectations

| Environment | Performance Target |
|-------------|--------------------|
| Local | Not Measured |
| Development | Functional |
| Staging | Production-Level |
| Production | SLA Targets |

---

# Access Control

| Environment | Access |
|-------------|--------|
| Local | Developer |
| Development | Development Team |
| Staging | Developers + QA + Product Owner |
| Production | Authorized Personnel Only |

---

# Deployment Rules

| Source | Destination | Allowed |
|---------|-------------|---------|
| Local | Development | ✅ |
| Development | Staging | ✅ |
| Staging | Production | ✅ |
| Local | Production | ❌ |
| Development | Production | ❌ |

---

# Release Promotion

```
Feature Complete

↓

Merge Develop

↓

Deploy Development

↓

QA Verification

↓

Deploy Staging

↓

UAT Approval

↓

Deploy Production
```

---

# Environment Health Checks

Verify

- Database Connectivity
- API Availability
- Authentication
- Storage Access
- Environment Variables
- Background Services

---

# Backup Requirements

Development

Optional

Staging

Recommended

Production

Mandatory

---

# Disaster Recovery

Only Production Requires

- Recovery Objectives
- Backup Validation
- Failover Planning
- Incident Response

---

# Environment Checklist

Before Deployment

- Correct Environment Selected
- Secrets Configured
- Database Reachable
- Storage Accessible
- Monitoring Enabled
- Health Checks Passing

---

# Common Mistakes

Avoid

- Using Production Secrets In Development
- Sharing Databases Across Environments
- Manual Production Changes
- Skipping Staging Validation
- Deploying Untested Builds

---

# Success Criteria

Environment management is successful when:

- Environments Are Fully Isolated
- Deployments Follow Promotion Flow
- Secrets Remain Protected
- Production Data Is Never Exposed
- Staging Mirrors Production
- Monitoring Is Active
- Health Checks Pass
- Rollback Procedures Are Available

---

# Best Practices

- Keep Environments Independent
- Mirror Production In Staging
- Automate Environment Provisioning
- Rotate Secrets Regularly
- Verify Environment Variables Before Deployment
- Restrict Production Access
- Never Test Directly In Production
- Maintain Consistent Configuration
- Document Environment Changes
- Review Environment Health Frequently

---

# Future Enhancements

- Infrastructure as Code (Terraform)
- Ephemeral Preview Environments
- Automated Environment Provisioning
- Self-Service Development Environments
- Secret Rotation Automation
- Environment Drift Detection
- Production Readiness Score
- Multi-Region Staging
- Immutable Infrastructure
- Environment Compliance Auditing