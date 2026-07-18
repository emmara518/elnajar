# الصفحة: لوحة التحكم (Admin Dashboard)

## الهدف

توفير لوحة تحكم احترافية تمكن مالك المتجر أو المدير من إدارة جميع أجزاء النظام من مكان واحد، مع مراقبة المبيعات، المنتجات، العملاء، الطلبات، المخزون، التقارير، والصلاحيات.

---

# Route

/admin

---

# Access Rules

Authentication Required

Owner

Full Access

Admin

Role Based Access

Branch Manager

Limited Access

Cashier

POS Only

Unauthorized

403 Forbidden

---

# Layout

Admin Header

↓

Sidebar

+

Main Workspace

↓

Footer

---

# Sidebar Navigation

Dashboard

Orders

Products

Categories

Customers

Inventory

Suppliers

Purchases

Coupons

Offers

Reviews

Reports

Finance

Notifications

Employees

Roles & Permissions

Settings

Activity Logs

Backup

Logout

---

# Header

Height

72px

Contains

Sidebar Toggle

Search

Global Notifications

Quick Actions

Language Switch

Dark Mode

User Avatar

Profile Menu

---

# Global Search

Search

Products

Orders

Customers

Invoices

Employees

Categories

Suppliers

Keyboard Shortcut

CTRL + K

---

# Dashboard Overview

Responsive Cards

Desktop

4 Cards

Tablet

2 Cards

Mobile

1 Column

---

## KPI Card

Today's Sales

---

## KPI Card

Today's Orders

---

## KPI Card

Active Customers

---

## KPI Card

Products In Stock

---

# Sales Analytics

Chart Type

Area Chart

Periods

Today

Week

Month

Year

Custom Range

Metrics

Revenue

Orders

Average Order

Profit

Refunds

---

# Revenue Breakdown

Cash

Instapay

Vodafone Cash

Wallet

Pending Payments

Refunds

---

# Orders Widget

Latest Orders

Columns

Order Number

Customer

Payment

Status

Amount

Time

Actions

---

Order Status

Pending

Confirmed

Packing

Shipping

Delivered

Cancelled

Refunded

---

# Products Widget

Low Stock

Out Of Stock

Best Sellers

Recently Added

Hidden Products

Draft Products

---

Actions

Edit

Delete

Duplicate

Archive

View

---

# Inventory Widget

Total Products

Available Stock

Reserved Stock

Low Stock

Expired Items

Incoming Stock

---

# Customer Widget

New Customers

Returning Customers

VIP Customers

Wholesale Customers

Inactive Customers

---

# Reviews Widget

Pending Reviews

Approved Reviews

Reported Reviews

Average Rating

---

# Notifications Center

Orders

Payments

Inventory Alerts

New Customers

Support Tickets

System Alerts

Employee Activity

---

# Calendar Widget

Today's Tasks

Upcoming Deliveries

Scheduled Promotions

Public Holidays

Inventory Count

---

# Quick Actions

Create Product

Create Category

Add Customer

Create Coupon

Create Offer

Create Purchase Order

Export Report

Backup Database

---

# Orders Module

Route

/admin/orders

Functions

View Orders

Filter Orders

Search Orders

Edit Orders

Cancel Orders

Refund Orders

Print Invoice

Assign Courier

Export Orders

---

# Products Module

Route

/ admin/products

Functions

Create Product

Edit Product

Delete Product

Duplicate Product

Import Products

Export Products

Bulk Edit

Manage Images

Manage Variants

SEO Settings

---

Product Fields

Name

SKU

Barcode

Category

Brand

Description

Specifications

Images

Price

Wholesale Price

Discount

Stock

Weight

Dimensions

Visibility

Featured

Status

---

# Categories Module

Create

Edit

Delete

Reorder

Nested Categories

Category Banner

SEO

Icon

Image

---

# Inventory Module

Stock Movements

Purchase Orders

Manual Adjustments

Warehouse Transfers

Inventory Audit

Damaged Products

Returns

Alerts

---

# Suppliers Module

Supplier Name

Phone

Email

Address

Products

Purchase History

Outstanding Balance

Notes

---

# Customers Module

Customer Details

Orders

Addresses

Invoices

Loyalty Points

Notes

Blacklist

Export

---

# Coupons Module

Create Coupon

Percentage

Fixed Amount

Minimum Order

Maximum Discount

Usage Limit

Expiry Date

Assigned Customers

Analytics

---

# Offers Module

Flash Sale

Category Discount

Product Discount

BOGO

Wholesale Offers

Scheduled Offers

---

# Reviews Module

Approve

Reject

Delete

Reply

Report

Spam Filter

---

# Reports Module

Sales Report

Orders Report

Inventory Report

Customers Report

Products Report

Profit Report

Tax Report

Export PDF

Export Excel

CSV Export

---

# Finance Module

Revenue

Expenses

Profit

Pending Payments

Refunds

Invoices

Cash Flow

Taxes

---

# Employees Module

Create Employee

Edit Employee

Deactivate

Reset Password

Assign Branch

Assign Role

Attendance (Future)

---

# Roles & Permissions

Owner

Admin

Branch Manager

Cashier

Custom Roles

---

Permissions

Products

Orders

Customers

Inventory

Reports

Finance

Settings

Employees

Backup

Logs

---

# Settings Module

Store Information

Logo

Contact Details

Working Hours

Shipping

Payment Methods

Tax Settings

Invoice Settings

Email Settings

SMS Settings

WhatsApp Settings

SEO

Maintenance Mode

Theme

Languages

Currencies

---

# Activity Logs

User

Action

Module

IP Address

Browser

Timestamp

Affected Record

Old Value

New Value

---

# Backup Module

Manual Backup

Automatic Backup

Restore Backup

Download Backup

Backup History

Database Backup

Images Backup

Settings Backup

---

# Security Dashboard

Failed Logins

Blocked Users

API Requests

Suspicious Activity

Session Monitoring

Password Policy

2FA Status

Audit Logs

---

# System Health

CPU Usage

RAM Usage

Database Status

Storage Usage

API Response Time

Queue Status

Background Jobs

Cron Status

---

# Components

Sidebar

Header

Search

Statistic Cards

Charts

Tables

Forms

Modals

Drawer

Notifications

Calendar

Pagination

Breadcrumb

Footer

---

# UX

Persistent Sidebar

Resizable Tables

Saved Filters

Bulk Actions

Keyboard Shortcuts

Autosave Forms

Undo Delete

Toast Notifications

Drag & Drop

Infinite Scroll

---

# Responsive

Desktop

Full Sidebar

Large Tables

---

Laptop

Compact Sidebar

Responsive Charts

---

Tablet

Collapsible Sidebar

Cards Layout

---

Mobile

Drawer Navigation

Cards Instead Of Tables

Bottom Actions

---

# Accessibility

WCAG AA

Keyboard Navigation

Visible Focus

Screen Reader

ARIA Labels

Accessible Charts

Accessible Tables

Contrast Ratio

---

# Loading State

Skeleton Cards

Skeleton Charts

Skeleton Tables

Skeleton Forms

Progress Indicators

---

# Empty State

No Orders

No Products

No Reports

No Customers

No Notifications

---

# Error State

Server Error

Database Error

API Timeout

Unauthorized

Retry Actions

---

# Performance

Virtualized Tables

Lazy Loading

Chart Lazy Rendering

Pagination

Caching

Image Compression

Code Splitting

Indexed Search

---

# SEO

Not Applicable

Admin Area

Robots

noindex

---

# API

Authentication

POST /auth/login

POST /auth/logout

POST /auth/refresh

---

Dashboard

GET /admin/dashboard

GET /admin/statistics

GET /admin/analytics

---

Orders

GET /admin/orders

POST /admin/orders

PUT /admin/orders/:id

DELETE /admin/orders/:id

---

Products

GET /admin/products

POST /admin/products

PUT /admin/products/:id

DELETE /admin/products/:id

---

Categories

GET /admin/categories

POST /admin/categories

PUT /admin/categories/:id

DELETE /admin/categories/:id

---

Inventory

GET /admin/inventory

PUT /admin/inventory

POST /admin/inventory/movement

---

Customers

GET /admin/customers

PUT /admin/customers/:id

DELETE /admin/customers/:id

---

Reports

GET /admin/reports/sales

GET /admin/reports/orders

GET /admin/reports/products

GET /admin/reports/customers

GET /admin/reports/profit

---

Settings

GET /admin/settings

PUT /admin/settings

---

Employees

GET /admin/employees

POST /admin/employees

PUT /admin/employees/:id

DELETE /admin/employees/:id

---

Roles

GET /admin/roles

POST /admin/roles

PUT /admin/roles/:id

DELETE /admin/roles/:id

---

Backup

POST /admin/backup

POST /admin/restore

GET /admin/backups

---

Logs

GET /admin/activity

GET /admin/security

---

# Validation Rules

Role-Based Authorization

Server Side Validation

Optimistic Locking

Soft Delete

Unique SKU

Unique Barcode

Stock Validation

Payment Verification

Invoice Validation

Permission Validation

---

# Analytics

Track Admin Login

Track Dashboard Views

Track Product Creation

Track Product Updates

Track Order Processing

Track Report Exports

Track Inventory Adjustments

Track Employee Actions

Track Failed Logins

Track Security Events

---

# Security

JWT Authentication

Role Based Access Control (RBAC)

Row Level Security (RLS)

CSRF Protection

Rate Limiting

Password Hashing (Argon2/Bcrypt)

Multi-Factor Authentication (2FA Ready)

Secure File Upload

Audit Logs

Session Management

IP Monitoring

Device Tracking

Encrypted Backups

Signed URLs

---

# Future Features

Multi-Branch Management

Advanced Warehouse Management

POS Integration

Accounting Integration

Supplier Portal

Customer CRM

Marketing Automation

AI Sales Forecasting

AI Inventory Prediction

AI Demand Planning

WhatsApp Business Integration

Email Campaigns

Scheduled Reports

Real-Time Notifications

Business Intelligence Dashboard

Offline Mode (PWA)

Disaster Recovery

Plugin Marketplace

Multi-Tenant Support