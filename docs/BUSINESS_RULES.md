# BUSINESS RULES
# TOKYO Packaging Store

Version: 1.0

---

# Purpose

This document defines the business rules of TOKYO Packaging Store.

Every feature, API, database table and UI component must respect these rules.

If any future implementation conflicts with this document, this document takes precedence.

---

# Business Model

The platform sells packaging and disposable products.

The platform supports:

• Retail Customers (B2C)

• Business Customers (B2B)

Both customer types use the same storefront.

---

# Store Philosophy

Customers are usually buying supplies for a business.

They are not shopping for entertainment.

The platform should help customers purchase complete packaging solutions quickly.

Every decision should reduce ordering time.

---

# Product Ownership

Every product belongs to:

One Category

One Brand

Multiple Images

Optional Variants

Optional Related Products

Optional Compatible Products

---

# Product Status

Products may be:

Draft

Published

Out Of Stock

Hidden

Archived

Only Published products appear in the storefront.

---

# Product Availability

Products may be:

Available

Limited Stock

Out Of Stock

Discontinued

Pre Order (Future)

---

# Selling Units

Products may be sold as:

Piece

Pack

Bundle

Box

Carton

Master Carton

Each unit may have:

Different Price

Different SKU

Different Barcode

Different Stock

---

# Product Variants

Variants may include:

Color

Capacity

Material

Thickness

Dimensions

Package Size

Shape

Variants may affect:

Price

Stock

Images

SKU

Barcode

Weight

---

# Compatible Products

Some products require compatible accessories.

Examples:

Paper Cup

→ Cup Lid

Meal Box

→ Matching Lid

Plastic Cup

→ Dome Lid

Paper Bag

→ Tissue

Coffee Cup

→ Wooden Stirrer

Meal Tray

→ Plastic Cutlery

Compatible products should always be suggested.

---

# Related Products

Related products are optional recommendations.

Example:

Napkins

↓

Cleaning Wipes

Coffee Cups

↓

Coffee Sleeves

Paper Bags

↓

Gift Stickers

Unlike compatible products, related products are not mandatory.

---

# Frequently Bought Together

The system should automatically support grouped recommendations.

Example:

Paper Cup

Cup Lid

Wooden Stirrer

Sugar

Napkin

Carry Tray

The objective is increasing average order value.

---

# Pricing Rules

Products may have:

Regular Price

Sale Price

Wholesale Price (Future)

Bulk Discount (Future)

Time Limited Offer

Discount Percentage

Only one active promotional price should be applied.

---

# Discount Rules

Discounts may come from:

Product Discount

Category Discount

Coupon

Seasonal Campaign

The system should never apply conflicting discounts unless explicitly configured.

---

# Coupon Rules

Coupons may support:

Percentage

Fixed Amount

Free Shipping

Minimum Order

Maximum Discount

Expiration Date

Usage Limit

Customer Limit

---

# Inventory Rules

Stock cannot become negative.

Out-of-stock products cannot be purchased.

Inventory updates immediately after successful order confirmation.

Reserved inventory is future scope.

---

# Order Rules

Order Status:

Pending

Confirmed

Preparing

Packed

Shipped

Delivered

Cancelled

Refunded

Only administrators can manually change order status.

---

# Cart Rules

Customers may:

Increase Quantity

Decrease Quantity

Remove Product

Apply Coupon

Estimate Shipping

Save Cart (Future)

Cart should survive page refresh.

---

# Shipping Rules

Shipping cost depends on:

Governorate

City

Order Total

Shipping Method

Future:

Weight Based Shipping

Volume Based Shipping

---

# Payment Rules

Supported:

Cash On Delivery

Credit Card

Debit Card

Meeza

Instapay

Vodafone Cash

Future:

Apple Pay

Google Pay

Payments should only be captured after successful checkout.

---

# Customer Rules

Guest users can browse.

Guest users can add to cart.

Guest users may checkout.

Registered customers gain:

Order History

Wishlist

Saved Addresses

Profile

---

# Wishlist Rules

Wishlist is customer specific.

Guests cannot permanently save wishlist.

Future synchronization across devices.

---

# Review Rules

Only verified customers should review products.

Future:

Photo Reviews

Video Reviews

Review Voting

---

# Product Images

Every product must have:

Primary Image

Gallery Images

Optional Video

Optional 360 Images (Future)

High quality images are required.

---

# Search Rules

Search should prioritize:

Exact Product Name

SKU

Barcode

Category

Brand

Popular Products

Search must understand packaging terminology.

---

# Homepage Rules

Homepage should always prioritize:

Current Campaigns

Top Selling Products

Business Essentials

Seasonal Products

Featured Categories

Current Offers

New Arrivals

Popular Brands

---

# Business Logic Priority

Whenever there is uncertainty:

Business Rules

↓

Product Rules

↓

Customer Experience

↓

Technical Convenience

Business logic always has priority over implementation convenience.

---

# AI Development Rules

Never generate marketplace features.

Never generate ERP functionality.

Never assume products are fashion items.

Never generate clothing-specific UI.

Never generate electronics-specific specifications.

Always optimize for:

Packaging Industry

Restaurants

Coffee Shops

Retail Supplies

Business Purchasing

The application is a specialized commerce platform.

Every implementation must respect that business domain.