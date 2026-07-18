# الصفحة: تتبع الطلب (Order Tracking)

## الهدف

تمكين العميل من متابعة حالة الطلب لحظة بلحظة، بدءًا من استلام الطلب وحتى التسليم النهائي، مع توفير شفافية كاملة حول مراحل التنفيذ والشحن.

---

# Route

/orders/:orderId

/tracking/:trackingNumber

/account/orders/:orderId

---

# Access Rules

Authenticated User

Allowed

Guest User

Allowed Using

Order Number

Phone Number

Tracking Number

Verification Code (Optional)

---

# Layout

Header

↓

Breadcrumb

↓

Tracking Header

↓

Order Timeline

↓

Order Information

↓

Shipment Information

↓

Order Items

↓

Payment Information

↓

Support Section

↓

Recommended Products

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

Account

Sticky Header

---

# Breadcrumb

الرئيسية

>

طلباتي

>

تتبع الطلب

---

# Tracking Header

Card Layout

Contains

Order Number

Tracking Number

Current Status

Order Date

Estimated Delivery

Delivery Method

Total Amount

Status Badge

---

# Status Badge

Pending

Processing

Confirmed

Packed

Shipped

Out For Delivery

Delivered

Cancelled

Returned

Refunded

---

# Progress Timeline

Horizontal

Desktop

Vertical

Mobile

---

## Timeline Steps

تم استلام الطلب

↓

جار مراجعة الطلب

↓

تم تأكيد الطلب

↓

جار تجهيز الطلب

↓

تم تسليم الطلب لشركة الشحن

↓

خرج للتوصيل

↓

تم التسليم

---

Each Step Contains

Status Icon

Title

Timestamp

Description

Operator

Completed Indicator

---

# Live Status Card

Current Stage

Estimated Remaining Time

Estimated Delivery Date

Delivery Window

Courier Name

Courier Phone (Optional)

Vehicle Number (Optional)

---

# Shipment Information

Shipping Company

Tracking Number

Shipping Method

Shipping Cost

Dispatch Date

Expected Arrival

Warehouse

---

# Delivery Address

Recipient Name

Phone Number

Governorate

City

Street

Building

Floor

Apartment

Landmark

---

# Order Information

Order ID

Invoice Number

Purchase Date

Order Type

Retail

Wholesale

Total Items

Total Quantity

---

# Order Items

Responsive Table

Columns

Image

Product

SKU

Quantity

Unit Price

Discount

Subtotal

Status

---

Each Product

Clickable

Navigate To Product Page

---

# Payment Information

Payment Method

Payment Status

Paid Amount

Remaining Amount

Receipt Status

Invoice Status

---

Payment Status

Pending

Paid

Awaiting Verification

Failed

Refunded

---

# Delivery Information

Estimated Arrival

Delivery Notes

Receiver Instructions

Special Requests

---

# Support Section

Need Help?

Contact Support

WhatsApp

Phone

Email

Live Chat

Open Ticket

---

# Actions

Download Invoice

Print Order

Reorder

Cancel Order

Request Return

Contact Courier

---

# Cancel Order

Available Only If

Pending

Processing

Confirmation Modal

Reason Required

---

# Return Order

Available Only If

Delivered

Return Window Active

Select Products

Reason

Upload Images

Submit Request

---

# Notifications

Order Confirmed

Order Packed

Order Shipped

Courier Assigned

Out For Delivery

Delivered

Refund Completed

---

# Empty State

Order Not Found

Message

لم يتم العثور على الطلب

Primary Button

العودة للرئيسية

Secondary Button

تواصل مع الدعم

---

# Error State

Tracking Service Unavailable

Retry Button

Contact Support

---

# Loading State

Skeleton Timeline

Skeleton Summary

Skeleton Order Items

---

# Components

Header

Breadcrumb

Status Card

Timeline

Order Summary

Shipment Card

Products Table

Payment Card

Support Card

Footer

---

# UX

Realtime Timeline Updates

Auto Refresh

Expandable Timeline Events

Copy Tracking Number

Quick Contact Actions

Persistent Status Badge

---

# Responsive

Desktop

Horizontal Timeline

Detailed Table

---

Laptop

Compressed Layout

---

Tablet

Cards Layout

Scrollable Timeline

---

Mobile

Vertical Timeline

Cards Instead Of Table

Sticky Support Button

---

# Accessibility

Keyboard Navigation

Screen Reader Labels

Accessible Timeline

Focus Indicators

Contrast AA

Alt Images

ARIA Live For Status Updates

---

# Performance

Lazy Load Timeline

Lazy Product Images

Optimized Polling

Caching

Deferred Support Widgets

Code Splitting

---

# SEO

Meta Title

تتبع الطلب

Meta Description

تابع حالة طلبك خطوة بخطوة حتى التسليم.

Robots

noindex

Canonical

/orders/:id

---

# API

GET /orders/:id

GET /tracking/:trackingNumber

GET /shipment/:id

POST /orders/:id/cancel

POST /orders/:id/return

GET /invoice/:id

---

# Response

orderId

trackingNumber

status

timeline

customer

shipping

payment

items

invoice

estimatedDelivery

courier

warehouse

---

# Validation Rules

Customer Owns Order

Tracking Number Valid

Return Window Active

Order Eligible For Cancellation

Order Eligible For Return

---

# Analytics

Track Order View

Track Timeline Expansion

Track Invoice Download

Track Reorder

Track Cancel Request

Track Return Request

Track Support Contact

Track Courier Contact

---

# Security

Authenticated Access

Guest Verification

Signed Invoice URLs

Secure Tracking Tokens

Audit Logs

Rate Limiting

Server Validation

---

# Future Features

Live Courier Map

Push Notifications

SMS Updates

WhatsApp Notifications

Delivery OTP Verification

Courier Live Chat

Delivery Rescheduling

Delivery Rating

Proof Of Delivery Images

AI Delivery Time Prediction