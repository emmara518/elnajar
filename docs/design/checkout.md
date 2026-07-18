# الصفحة: إتمام الطلب (Checkout)

## الهدف

توفير تجربة Checkout احترافية وسريعة وآمنة تقلل معدل التخلي عن السلة (Cart Abandonment)، مع تقسيم عملية الشراء إلى خطوات واضحة وإظهار ملخص الطلب بشكل دائم.

---

# Route

/checkout

---

# Access Rules

Authentication

Optional

Guest Checkout

Supported

Returning Customer

Supported

New Customer

Supported

---

# Layout

Header

↓

Breadcrumb

↓

Checkout Progress

↓

Checkout Content

↓

Order Summary

↓

Footer

---

# Checkout Steps

1. بيانات العميل

↓

2. عنوان الشحن

↓

3. طريقة الشحن

↓

4. طريقة الدفع

↓

5. مراجعة الطلب

↓

6. تأكيد الطلب

---

# Progress Indicator

Horizontal Stepper

Desktop

6 Steps

Tablet

Compact

Mobile

Scrollable

Completed

Green

Current

Gold

Pending

Gray

---

# Main Layout

Desktop

2 Columns

Left

Checkout Form

Right

Sticky Order Summary

---

Tablet

Single Column

---

Mobile

Vertical Layout

Summary Fixed Bottom

---

# Customer Information

Section Title

بيانات العميل

Fields

First Name

Last Name

Phone Number

Email Address

Company Name (Optional)

Tax Number (Optional)

Notes (Optional)

---

# Validation

First Name Required

Last Name Required

Phone Required

Valid Egyptian Number

Email Optional

If Entered Must Be Valid

---

# Shipping Address

Section Title

عنوان الشحن

Fields

Governorate

City

Area

Street

Building

Floor

Apartment

Landmark

Postal Code

---

# Address Book

Logged User Only

Add Address

Edit Address

Delete Address

Default Address

---

# Shipping Method

Section Title

طريقة الشحن

Options

Standard Delivery

Express Delivery

Store Pickup

Wholesale Delivery

---

Each Method Displays

Price

Estimated Time

Availability

Description

---

# Shipping Rules

Calculate Automatically

Based On

Governorate

Weight

Volume

Minimum Order

---

# Payment Method

Section Title

طريقة الدفع

Supported

Instapay

Vodafone Cash

Electronic Wallet

Cash On Delivery (Optional)

Bank Transfer

---

# Payment Cards

Each Card Contains

Logo

Title

Description

Selection Radio

Recommended Badge

---

# Manual Payment

When Selected

Display

Instapay Number

Vodafone Cash Number

Wallet QR Code

Transfer Instructions

---

# Payment Receipt Upload

Visible

Only For

Manual Payments

Supported Formats

PNG

JPG

JPEG

PDF

Maximum Size

10 MB

---

# Receipt Information

Transaction Number

Transfer Time

Amount Paid

Upload Button

Preview

Remove

---

# Invoice Information

Need Invoice

Checkbox

If Checked

Display

Company Name

Commercial Registration

Tax Number

---

# Order Notes

Textarea

Placeholder

أضف أي ملاحظات خاصة بطلبك...

Maximum

500 Characters

---

# Terms & Conditions

Checkbox

Required

Links

Privacy Policy

Terms

Return Policy

---

# Order Summary

Sticky Card

Contains

Products Total

Discount

Coupon

Shipping

VAT

Grand Total

Estimated Savings

Total Items

---

# Coupon Preview

Applied Coupon

Discount Value

Remove Coupon

---

# Checkout Actions

Primary Button

تأكيد الطلب

Secondary Button

الرجوع للسلة

---

# Confirmation Modal

Before Submission

Display

Order Total

Payment Method

Shipping Address

Confirmation Button

Cancel Button

---

# Order Success

Illustration

Success Icon

Message

تم استلام طلبك بنجاح

Order Number

Estimated Delivery

Track Order Button

Continue Shopping Button

Download Invoice Button

---

# Failed Payment

Illustration

Message

تعذر إتمام عملية الدفع

Retry Payment

Contact Support

---

# Components

Header

Breadcrumb

Stepper

Checkout Form

Address Card

Shipping Card

Payment Card

Receipt Upload

Summary Card

Buttons

Success Screen

Footer

---

# UX

Auto Save Form

Realtime Validation

Auto Fill

Address Suggestions

Sticky Summary

Prevent Double Submission

Loading Indicators

Smooth Step Transition

---

# Responsive

Desktop

Two Columns

Sticky Summary

---

Laptop

Two Columns

Compact Form

---

Tablet

Single Column

Summary Bottom

---

Mobile

Vertical

Collapsible Summary

Sticky Confirm Button

---

# Accessibility

Keyboard Navigation

Logical Tab Order

Visible Focus

ARIA Labels

Accessible Upload

Error Announcement

Screen Reader Support

Contrast AA

---

# Loading State

Skeleton Form

Skeleton Summary

Skeleton Stepper

---

# Empty State

No Cart Items

Redirect To Cart

---

# Error State

Payment Failed

Address Invalid

Upload Failed

Network Error

Retry Actions

---

# Performance

Lazy Load Payment Icons

Optimized Validation

Deferred Address Lookup

Image Compression

Code Splitting

---

# SEO

Meta Title

إتمام الطلب

Meta Description

أكمل عملية شراء منتجاتك بسهولة وأمان.

Robots

noindex

Canonical

/checkout

---

# API

GET /checkout

GET /shipping-methods

GET /payment-methods

GET /addresses

POST /addresses

PUT /addresses/:id

DELETE /addresses/:id

POST /checkout

POST /receipt/upload

POST /invoice/request

---

# Validation Rules

Cart Not Empty

Valid Address

Valid Shipping Method

Valid Payment Method

Receipt Required For Manual Payment

Terms Accepted

Stock Available

Server Price Validation

---

# Analytics

Track Checkout Started

Track Step Completion

Track Shipping Selection

Track Payment Selection

Track Receipt Upload

Track Checkout Success

Track Checkout Failure

Track Abandoned Checkout

---

# Security

Server Side Validation

CSRF Protection

Receipt Virus Scan

Secure File Upload

Duplicate Order Prevention

Price Recalculation

Stock Lock During Checkout

Rate Limiting

---

# Future Features

Apple Pay

Google Pay

One-Click Checkout

Saved Payment Methods

Split Payments

Installments

Gift Messages

Scheduled Delivery

Invoice PDF Generation

Loyalty Points Redemption