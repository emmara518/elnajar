# الصفحة: سلة التسوق (Shopping Cart)

## الهدف

توفير تجربة مراجعة احترافية قبل إتمام عملية الشراء، مع إمكانية تعديل الكميات، حذف المنتجات، تطبيق كوبونات الخصم، ومعرفة التكلفة النهائية بصورة واضحة.

---

# Route

/cart

---

# Layout

Header

↓

Breadcrumb

↓

Cart Header

↓

Cart Content

↓

Order Summary

↓

Recommended Products

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

Account

Wishlist

Cart

Sticky Header

---

# Breadcrumb

الرئيسية

>

سلة التسوق

---

# Cart Header

Title

سلة التسوق

Subtitle

راجع منتجاتك قبل إتمام الطلب

Items Counter

عدد المنتجات

---

# Cart Layout

Desktop

2 Columns

Left

Cart Items

Right

Order Summary

---

Tablet

Single Column

---

Mobile

Vertical Layout

---

# Cart Item

Each Item Contains

Product Image

Product Name

Category

SKU

Price

Old Price

Discount Badge

Availability

Quantity Selector

Subtotal

Remove Button

Move To Wishlist

---

# Product Image

Clickable

Navigate To Product Details

Lazy Loaded

---

# Product Information

Product Name

Category

Brand

Short Description

---

# Quantity Selector

Minus Button

Input

Plus Button

Maximum Available Quantity

Minimum Quantity

Validation

Realtime Price Update

---

# Price

Current Price

Old Price

Discount %

Wholesale Indicator

---

# Stock Status

متوفر

كمية محدودة

غير متوفر

---

# Actions

Remove Product

Save For Later

Move To Wishlist

Share Product

---

# Cart Controls

Continue Shopping

Clear Cart

Update Cart

---

# Coupon Section

Card Layout

Input

Coupon Code

Apply Button

Remove Coupon

Validation Message

---

## Coupon States

Valid

Expired

Already Used

Minimum Order Not Reached

Invalid Code

---

# Gift Card

Optional

Input

Apply Button

---

# Shipping Calculator

Governorate Dropdown

City Dropdown

Calculate Button

Shipping Cost

Estimated Delivery

---

# Order Summary

Sticky Card (Desktop)

Contains

Products Total

Discount

Coupon Discount

Shipping

VAT

Grand Total

Savings

---

# Payment Methods Preview

Instapay

Vodafone Cash

Electronic Wallet

Cash On Delivery (Optional)

Display Icons

---

# Checkout CTA

Primary Button

إتمام الطلب

Secondary Button

متابعة التسوق

---

# Secure Checkout Notice

SSL

Secure Payment

Protected Order

Support Contact

---

# Recommended Products

Section Title

قد يعجبك أيضاً

Layout

Horizontal Slider

6 Products

---

# Recently Viewed

Horizontal Slider

Maximum

10 Products

---

# Empty Cart State

Illustration

Message

سلة التسوق فارغة

Primary Button

ابدأ التسوق

Secondary Button

العودة للرئيسية

---

# Error State

تعذر تحديث السلة

Button

إعادة المحاولة

---

# Loading State

Skeleton Cart Items

Skeleton Summary

Skeleton Recommendations

---

# Components

Header

Breadcrumb

Cart Item

Quantity Selector

Coupon Card

Shipping Calculator

Summary Card

CTA Buttons

Recommendation Slider

Footer

---

# UX

Realtime Price Update

Instant Quantity Change

Sticky Summary

Swipe To Remove (Mobile)

Undo Remove (Snackbar)

Smooth Animations

Persistent Cart

---

# Responsive

Desktop

2 Columns

Sticky Summary

---

Laptop

2 Columns

Compact Layout

---

Tablet

Single Column

Summary Below Items

---

Mobile

Vertical Layout

Bottom Sticky Checkout Button

Swipe Gestures

---

# Accessibility

Keyboard Navigation

Focus States

ARIA Labels

Accessible Buttons

Alt Images

Screen Reader Support

Contrast AA

---

# Performance

Lazy Images

Optimized Rendering

Memoized Cart Items

Debounced Quantity Updates

WebP Images

Code Splitting

---

# SEO

Meta Title

سلة التسوق

Meta Description

راجع طلبك قبل إتمام عملية الشراء.

Robots

noindex

Canonical

/cart

---

# API

GET /cart

Response

items

subtotal

discount

shipping

tax

total

---

POST /cart/add

PUT /cart/update

DELETE /cart/remove

DELETE /cart/clear

POST /coupon/apply

DELETE /coupon/remove

POST /shipping/calculate

---

# Validation Rules

Quantity ≥ Minimum

Quantity ≤ Available Stock

Coupon Valid

Shipping Available

Cart Not Empty

---

# Analytics

Track Cart View

Track Quantity Change

Track Remove Item

Track Coupon Apply

Track Shipping Calculation

Track Checkout Click

Track Continue Shopping

Track Wishlist Move

---

# Security

Validate Coupon Server Side

Validate Stock Before Checkout

Prevent Price Manipulation

Recalculate Totals On Server

Session-Based Cart Validation

---

# Future Features

Save Cart

Share Cart

Bulk Quantity Editing

AI Recommended Bundles

Frequently Bought Together

Estimated Savings Insights

Loyalty Points Preview

Abandoned Cart Recovery

One-Click Reorder

Gift Wrapping Option