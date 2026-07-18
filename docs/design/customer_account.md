# الصفحة: حسابي (Customer Account)

## الهدف

توفير لوحة تحكم متكاملة للعميل لإدارة حسابه الشخصي، الطلبات، العناوين، وسائل الدفع، المفضلة، والإشعارات من مكان واحد.

---

# Route

/account

---

# Access Rules

Authentication Required

Guest

Redirect To Login

Customer

Allowed

Admin

Redirect To Dashboard

---

# Layout

Header

↓

Breadcrumb

↓

Account Header

↓

Sidebar Navigation

+

Content Area

↓

Footer

---

# Header

Reuse Global Header

Components

Top Bar

Navigation

Search

Wishlist

Cart

Notifications

Account Avatar

Sticky Header

---

# Breadcrumb

الرئيسية

>

حسابي

---

# Account Header

Cover Banner

↓

Avatar

↓

Customer Information

---

## Avatar

Profile Picture

Upload Image

Remove Image

Default Avatar

Supported Formats

PNG

JPG

WEBP

---

## Customer Information

Full Name

Customer ID

Email

Phone

Member Since

Membership Level

Loyalty Points

Total Orders

---

# Account Statistics

Grid

Desktop

4 Cards

Tablet

2 Cards

Mobile

1 Column

---

## Card 1

إجمالي الطلبات

---

## Card 2

إجمالي المشتريات

---

## Card 3

الطلبات الحالية

---

## Card 4

نقاط المكافآت

---

# Sidebar Navigation

لوحة التحكم

طلباتي

العناوين

المفضلة

الإشعارات

بيانات الحساب

تغيير كلمة المرور

طرق الدفع

الفواتير

الدعم الفني

تسجيل الخروج

---

# Dashboard Overview

Welcome Message

Recent Orders

Quick Actions

Recommended Products

Recent Notifications

---

# Orders Section

Title

طلباتي

---

Table

Columns

Order Number

Date

Status

Payment

Total

Actions

---

Actions

View Details

Track Order

Download Invoice

Reorder

Cancel Order

---

# Wishlist

Grid

Desktop

4 Columns

Tablet

3 Columns

Mobile

2 Columns

---

Each Item

Image

Product Name

Price

Stock

Move To Cart

Remove

---

# Saved Addresses

Cards Layout

Each Card

Recipient Name

Phone

Governorate

City

Street

Building

Floor

Apartment

Default Badge

---

Actions

Edit

Delete

Set As Default

Add New Address

---

# Payment Methods

Manual Payment

Instapay

Vodafone Cash

Saved Wallet Information (Optional)

Future Ready

Credit Cards

Apple Pay

Google Pay

---

# Profile Information

Editable Form

Fields

First Name

Last Name

Phone

Email

Birth Date

Company Name

Tax Number

Language

Preferred Currency

---

# Change Password

Current Password

New Password

Confirm Password

Password Strength Indicator

Save Button

---

# Notification Center

Order Updates

Offers

Coupons

Wholesale News

System Notifications

---

Notification Actions

Mark As Read

Delete

Clear All

---

# Loyalty Program

Current Points

Available Rewards

Redemption History

Next Level

Progress Bar

---

# Invoices

List

Invoice Number

Order Number

Date

Amount

Download PDF

---

# Support Center

Create Ticket

View Tickets

Chat Support

WhatsApp

Phone

Email

---

# Quick Actions

Continue Shopping

Browse Offers

Track Order

View Wishlist

Contact Support

---

# Empty States

Orders

لا توجد طلبات حتى الآن

Wishlist

المفضلة فارغة

Addresses

لا توجد عناوين محفوظة

Notifications

لا توجد إشعارات

---

# Loading State

Skeleton Header

Skeleton Statistics

Skeleton Orders

Skeleton Wishlist

---

# Error State

تعذر تحميل بيانات الحساب

Retry Button

---

# Components

Header

Breadcrumb

Profile Card

Statistics Cards

Sidebar

Orders Table

Wishlist Grid

Address Card

Notification List

Support Card

Footer

---

# UX

Persistent Sidebar

Auto Save Profile

Realtime Validation

Expandable Cards

Sticky Navigation

Responsive Tables

Quick Actions

---

# Responsive

Desktop

Sidebar Fixed

Content Wide

---

Laptop

Compact Sidebar

---

Tablet

Collapsible Sidebar

Cards Layout

---

Mobile

Bottom Navigation

Drawer Menu

Single Column

Sticky Quick Actions

---

# Accessibility

Keyboard Navigation

Screen Reader Support

Visible Focus

ARIA Labels

Accessible Forms

Contrast AA

Alt Images

---

# Performance

Lazy Load Orders

Lazy Wishlist Images

Pagination

Caching

Optimized Profile Images

Code Splitting

---

# SEO

Meta Title

حسابي

Meta Description

إدارة بيانات حسابك وطلباتك بسهولة.

Robots

noindex

Canonical

/account

---

# API

GET /account

PUT /account

POST /account/avatar

DELETE /account/avatar

GET /orders

GET /wishlist

POST /wishlist

DELETE /wishlist

GET /addresses

POST /addresses

PUT /addresses/:id

DELETE /addresses/:id

GET /notifications

PUT /notifications/read

DELETE /notifications

GET /loyalty

GET /invoices

POST /support/tickets

GET /support/tickets

---

# Validation Rules

Authenticated User

Valid Email

Valid Phone

Strong Password

Unique Default Address

Profile Image Size < 5MB

---

# Analytics

Track Account View

Track Profile Update

Track Address Changes

Track Wishlist Usage

Track Notification Reads

Track Invoice Downloads

Track Support Ticket Creation

Track Logout

---

# Security

JWT Authentication

Session Validation

CSRF Protection

Password Hashing

Rate Limiting

Audit Logs

Avatar Malware Scan

Email Verification

Phone Verification

---

# Future Features

Social Login

Two-Factor Authentication (2FA)

Biometric Login

Order Subscription

Saved Shopping Lists

Family Accounts

Business Accounts

Reward Tiers

AI Purchase Recommendations

Personalized Offers