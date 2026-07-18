# PRODUCT RULES
# TOKYO Packaging Store

Version: 1.0

---

# Purpose

This document defines the complete product model used throughout the application.

Every product page, API, database table, admin screen and customer experience must follow these rules.

If implementation conflicts with this document, this document has priority.

---

# Product Philosophy

Products are not generic consumer products.

Products belong to the packaging and disposable supplies industry.

Customers usually purchase products for business operations.

Every product should contain enough information to make purchasing decisions without contacting customer support.

---

# Product Identity

Every product must have:

Unique ID

SKU

Barcode (Optional)

Slug

Name (Arabic)

Name (English)

Short Description

Full Description

Status

Visibility

Created Date

Updated Date

---

# Product Status

Draft

Published

Hidden

Archived

Out Of Stock

Only Published products appear on the storefront.

---

# Product Categories

Every product belongs to one category.

Example:

Paper Cups

Plastic Cups

Cup Lids

Meal Boxes

Food Containers

Paper Plates

Plastic Plates

Bowls

Paper Bags

Shopping Bags

Gift Bags

Napkins

Kitchen Rolls

Aluminum Foil

Cling Film

Plastic Cutlery

Wooden Cutlery

Coffee Accessories

Cleaning Products

Restaurant Supplies

Packaging Supplies

---

# Brand

Each product belongs to one brand.

Examples:

Hotpack

Falcon

Fine

Local Brand

Private Label

Future brands can be added without changing product structure.

---

# Product Images

Every product must support:

Primary Image

Gallery Images

Hover Image

Thumbnail

Future:

Video

360 Viewer

Image order should be configurable.

---

# Product Variants

Variants are independent sellable items.

Each variant may have:

SKU

Barcode

Price

Stock

Weight

Image

Capacity

Color

Material

Dimensions

Package Quantity

Example:

Paper Cup

8 oz

12 oz

16 oz

20 oz

Each variant has different inventory.

---

# Product Specifications

Products may include:

Material

Color

Capacity

Dimensions

Diameter

Height

Width

Length

Weight

Thickness

Temperature Resistance

Microwave Safe

Freezer Safe

Food Grade

Disposable

Reusable

Eco Friendly

Country Of Origin

Manufacturer

Specifications should be dynamic.

Never hardcode specification fields.

---

# Packaging Information

Products may be sold using different packaging units.

Examples:

Piece

Pack

Bundle

Box

Carton

Master Carton

Every packaging level may have:

Different SKU

Different Barcode

Different Price

Different Stock

Different Weight

---

# Product Pricing

Every product supports:

Regular Price

Sale Price

Cost Price (Admin)

Wholesale Price (Future)

Bulk Price (Future)

Discount Percentage

Offer Start

Offer End

Currency

Only one active promotional price may exist.

---

# Product Inventory

Inventory tracks:

Current Stock

Reserved Stock (Future)

Minimum Stock

Maximum Stock

Stock Status

Inventory is tracked per variant.

---

# Product Visibility

Products may be:

Visible

Hidden

Search Only

Category Only

Featured Only

Future scheduling is supported.

---

# Product Labels

Products may have labels.

Examples:

New

Best Seller

Limited Offer

Hot Deal

Trending

Recommended

Exclusive

Clearance

Labels improve discoverability.

---

# Product Relationships

Products may be connected.

Relationship Types:

Compatible Products

Related Products

Accessories

Replacement Products

Alternative Products

Frequently Bought Together

Each relationship serves a different business purpose.

---

# Compatible Products

Compatible products solve compatibility problems.

Examples:

Paper Cup

↓

Matching Lid

Meal Box

↓

Matching Lid

Cup

↓

Cup Holder

Customers should clearly understand compatibility.

---

# Frequently Bought Together

These products increase basket size.

Example:

Paper Cup

Cup Lid

Wooden Stirrer

Napkin

Sugar

Carry Tray

The system should support displaying complete purchase sets.

---

# Related Products

Related products are recommendation based.

Example:

Paper Bag

↓

Gift Ribbon

Napkin

↓

Wet Wipes

Related products do not require compatibility.

---

# Product Reviews

Support:

Rating

Written Review

Verified Purchase

Review Date

Future:

Photos

Videos

Likes

Replies

---

# Product Search

Search should understand:

Product Name

Brand

SKU

Barcode

Category

Capacity

Material

Color

Popular Keywords

The search engine should prioritize exact product matches.

---

# SEO

Every product supports:

SEO Title

SEO Description

SEO Keywords

Canonical URL

Open Graph Image

Structured Data

Product Schema

Slug

---

# Product Lifecycle

Draft

↓

Published

↓

Available

↓

Low Stock

↓

Out Of Stock

↓

Archived

Every product follows this lifecycle.

---

# Business Rules

Products cannot exist without a category.

Products cannot exist without a price.

Products cannot exist without a primary image.

Variants inherit product information unless overridden.

Stock is managed at variant level.

Compatible products are optional.

Related products are optional.

Frequently bought together products are optional.

---

# AI Development Rules

Never model products as generic e-commerce items.

Always assume products belong to the packaging industry.

Always optimize product pages for business buyers.

Always prioritize product specifications over marketing content.

Avoid unnecessary animations.

Optimize for clarity, speed and usability.

The product model must support at least 100,000 products without architectural changes.