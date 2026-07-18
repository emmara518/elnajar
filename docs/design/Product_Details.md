# الصفحة: تفاصيل المنتج (Product Details)

## الهدف

تقديم صفحة منتج احترافية تساعد العميل على اتخاذ قرار الشراء بسرعة، مع عرض جميع المعلومات والصور والمواصفات والمراجعات والمنتجات المرتبطة بطريقة جذابة وسهلة الاستخدام.

---

# Route

/products/:slug

---

# Layout

Header

↓

Breadcrumb

↓

Product Section

↓

Product Information

↓

Specifications

↓

Wholesale Pricing

↓

Related Products

↓

Reviews

↓

FAQ

↓

Recently Viewed

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

Account

Cart

Sticky Header

---

# Breadcrumb

الرئيسية

>

القسم

>

اسم المنتج

---

# Product Hero Section

Two Columns

Desktop

Left

Product Gallery

Right

Product Information

Tablet

Stacked

Mobile

Vertical Layout

---

# Product Gallery

Main Image

Zoom On Hover

Thumbnail Slider

Image Counter

Fullscreen Preview

360° Ready

Product Video (Optional)

Supported Formats

JPG

PNG

WEBP

MP4

---

# Product Information

Product Name

SKU

Category

Brand

Availability

Short Description

Rating

Reviews Count

Sold Count

Share Buttons

---

# Pricing

Current Price

Old Price

Discount Percentage

Wholesale Price

Tax Status

Price Per Unit

Minimum Wholesale Quantity

Savings Indicator

---

# Stock Information

Status

متوفر

كمية محدودة

نفد

Available Quantity

Estimated Restock Date

---

# Quantity Selector

Minus Button

Input

Plus Button

Validation

Maximum Available Quantity

Minimum Quantity

Wholesale Minimum Quantity

---

# Purchase Actions

Primary Button

أضف إلى السلة

Secondary Button

شراء الآن

Wishlist

Compare

Share

Print

---

# Payment Information

Available Methods

Instapay

Vodafone Cash

Electronic Wallets

Cash On Delivery (Optional)

Display Payment Icons

Payment Notice

رفع إيصال الدفع بعد إتمام التحويل

---

# Shipping Information

Delivery Time

Shipping Cost

Free Shipping Threshold

Estimated Delivery

Available Governorates

---

# Product Description

Rich Text

Images

Lists

Tables

Embedded Media

Expandable Section

---

# Specifications

Accordion Layout

Material

Color

Capacity

Dimensions

Weight

Packaging

Usage

Manufacturer

Country Of Origin

Storage Instructions

Shelf Life

Barcode

SKU

---

# Wholesale Pricing

Table

Minimum Quantity

Wholesale Price

Savings

Examples

10 Pieces

50 Pieces

100 Pieces

500 Pieces

---

# Related Products

Grid

Desktop

4 Columns

Tablet

3 Columns

Mobile

2 Columns

Section Title

منتجات مشابهة

---

# Frequently Bought Together

Bundle Section

Suggested Products

Bundle Discount

Quick Add

---

# Customer Reviews

Overall Rating

Average Score

Rating Distribution

Review Cards

Customer Name

Date

Stars

Comment

Uploaded Images

Verified Purchase Badge

---

# Review Filters

Most Recent

Highest Rating

Lowest Rating

With Images

Verified Only

---

# Write Review

Rating Selector

Comment

Upload Images

Submit Button

Login Required

---

# Questions & Answers

Customer Questions

Store Answers

Ask Question Form

---

# Product Tags

Disposable

Foam

Paper

Restaurant

Takeaway

Packaging

Wholesale

---

# Recently Viewed

Horizontal Slider

Maximum

10 Products

---

# Sticky Purchase Bar

Desktop

Hidden

Mobile

Visible

Contains

Price

Quantity

Add To Cart

Buy Now

---

# Components

Header

Breadcrumb

Gallery

Thumbnail Slider

Zoom

Price Card

Stock Badge

Quantity Selector

CTA Buttons

Accordion

Review Card

FAQ

Related Products

Footer

---

# UX

Image Zoom

Gallery Swipe

Sticky Buy Box

Smooth Scroll

Accordion Animation

Floating Add To Cart (Mobile)

Persistent Quantity

---

# Responsive

Desktop

2 Columns

Large Gallery

Sticky Information

---

Laptop

2 Columns

Compressed Layout

---

Tablet

Single Column

Gallery First

---

Mobile

Vertical Layout

Sticky Bottom Purchase Bar

Swipe Gallery

---

# Accessibility

Keyboard Navigation

ARIA Labels

Alt Images

Focus States

Screen Reader Support

Accessible Forms

Contrast AA

---

# Loading State

Skeleton Gallery

Skeleton Product Info

Skeleton Reviews

Skeleton Related Products

---

# Empty State

لا توجد مراجعات بعد

كن أول من يقيم هذا المنتج

---

# Error State

تعذر تحميل بيانات المنتج

إعادة المحاولة

---

# Performance

Lazy Images

Responsive Images

WebP

Image CDN

Deferred Reviews

Code Splitting

---

# SEO

Meta Title

Meta Description

Product Schema

Offer Schema

Review Schema

Breadcrumb Schema

Canonical URL

OpenGraph

Twitter Card

---

# API

GET /products/:slug

Response

id

name

slug

sku

description

shortDescription

category

brand

images

video

price

oldPrice

wholesalePrices

discount

stock

rating

reviews

specifications

tags

relatedProducts

faq

shipping

paymentMethods

---

POST /cart

POST /wishlist

POST /compare

POST /reviews

POST /questions

---

# Analytics

Track Product View

Track Image Zoom

Track Gallery Navigation

Track Add To Cart

Track Buy Now

Track Wishlist

Track Compare

Track Share

Track Review Submission

Track FAQ Interaction

---

# Security

Sanitize Reviews

Validate Quantity

Prevent Duplicate Reviews

Rate Limit Review Submission

Secure Image Upload

Validate Product Availability

---

# Future Features

3D Product Viewer

AR Preview

AI Product Recommendations

Live Stock Counter

Back In Stock Notifications

Price History Chart

Bundle Builder

Subscription Purchase

Personalized Offers

Product Video Reviews