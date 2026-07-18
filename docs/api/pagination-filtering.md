# API Pagination & Filtering

**File:** `docs/api/06-pagination-filtering.md`

---

# Purpose

يوضح هذا المستند المعايير الموحدة لعمليات Pagination وFiltering وSorting وSearching داخل جميع واجهات برمجة التطبيقات.

الهدف هو تقديم واجهة API موحدة، سهلة الاستخدام، وقابلة للتوسع مع الحفاظ على الأداء.

---

# Objectives

- Consistent Pagination
- Efficient Filtering
- Flexible Sorting
- Full-Text Search
- Predictable Responses
- High Performance

---

# Supported Operations

```
Pagination

↓

Filtering

↓

Searching

↓

Sorting

↓

Field Selection
```

---

# Pagination Strategy

Default

```
Offset Pagination
```

Future

```
Cursor Pagination
```

---

# Default Parameters

| Parameter | Default | Maximum |
|------------|---------|----------|
| page | 1 | Unlimited |
| limit | 20 | 100 |

---

# Example Request

```http
GET /v1/products?page=2&limit=20
```

---

# Pagination Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 347,
    "total_pages": 18,
    "has_next": true,
    "has_previous": true
  }
}
```

---

# Pagination Metadata

| Field | Description |
|---------|-------------|
| page | Current page |
| limit | Records per page |
| total | Total matching records |
| total_pages | Number of pages |
| has_next | Next page exists |
| has_previous | Previous page exists |

---

# Limit Rules

Minimum

```
1
```

Maximum

```
100
```

Invalid Values

Return

```
422 Validation Error
```

---

# Filtering

Supported Through

Query Parameters

Example

```http
GET /v1/products?category=uuid
```

---

# Product Filters

| Parameter | Type |
|------------|------|
| category | UUID |
| brand | String |
| featured | Boolean |
| available | Boolean |
| min_price | Decimal |
| max_price | Decimal |
| rating | Integer |

Example

```http
GET /v1/products?brand=Acme&featured=true
```

---

# Order Filters

```
status

payment_status

customer_id

date_from

date_to
```

Example

```http
GET /v1/orders?status=SHIPPED
```

---

# Customer Filters

```
email

phone

created_from

created_to
```

---

# Inventory Filters

```
low_stock=true

out_of_stock=true
```

---

# Date Filters

Standard Format

```
YYYY-MM-DD
```

Example

```http
GET /v1/orders?date_from=2026-07-01&date_to=2026-07-31
```

---

# Numeric Filters

Example

```http
GET /v1/products?min_price=50&max_price=250
```

Validation

```
min_price <= max_price
```

---

# Boolean Filters

Supported Values

```
true

false
```

Invalid

```
1

0

yes

no
```

---

# Searching

Parameter

```
search
```

Example

```http
GET /v1/products?search=plastic cup
```

Search Fields

```
name

description

sku

barcode

brand
```

Backend

```
PostgreSQL Full Text Search

GIN Index
```

---

# Category Search

Example

```http
GET /v1/categories?search=paper
```

---

# Sorting

Parameters

```
sort

order
```

Example

```http
GET /v1/products?sort=price&order=asc
```

---

# Supported Sort Fields

Products

```
name

price

created_at

rating

popularity
```

Orders

```
created_at

total

status
```

Customers

```
created_at

full_name
```

Inventory

```
stock_quantity

updated_at
```

---

# Sort Direction

Allowed

```
asc

desc
```

Default

```
desc
```

---

# Multi-Column Sorting

Future Support

Example

```http
GET /v1/products?sort=category,name
```

---

# Field Selection

Optional

Parameter

```
fields
```

Example

```http
GET /v1/products?fields=id,name,price
```

Response

Only Requested Fields

---

# Include Related Resources

Optional

Parameter

```
include
```

Example

```http
GET /v1/orders?include=items,payment
```

Supported

```
items

payment

customer

category

images
```

---

# Default Sorting

Products

```
featured DESC

created_at DESC
```

Orders

```
created_at DESC
```

Reviews

```
created_at DESC
```

Notifications

```
created_at DESC
```

---

# Invalid Parameters

Return

```
422 Validation Error
```

Example

```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY_PARAMETER",
    "message": "Unsupported sort field."
  }
}
```

---

# Performance Guidelines

Always Index

```
Foreign Keys

Created Date

Search Fields

Status Fields
```

Avoid

- Deep Offsets (>10,000 rows)
- Unindexed Filters
- Expensive LIKE Queries
- Sorting On Large TEXT Columns

---

# Cursor Pagination

Future

Example

```http
GET /v1/products?cursor=eyJpZCI6...
```

Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "next_cursor": "...",
    "has_next": true
  }
}
```

Advantages

- Better Performance
- Stable Results
- Large Dataset Support

---

# Query Examples

Search

```http
GET /v1/products?search=container
```

Category

```http
GET /v1/products?category=uuid
```

Price Range

```http
GET /v1/products?min_price=20&max_price=80
```

Featured Products

```http
GET /v1/products?featured=true
```

Pagination

```http
GET /v1/products?page=3&limit=24
```

Sorting

```http
GET /v1/products?sort=price&order=asc
```

Combined

```http
GET /v1/products?page=2&limit=20&category=uuid&search=plastic&min_price=50&max_price=150&sort=price&order=desc
```

---

# Validation Rules

- `page >= 1`
- `limit <= 100`
- Valid UUIDs
- Valid Enum Values
- Valid Dates
- Valid Sort Fields
- Valid Filter Names

---

# Monitoring

Track

- Average Query Time
- Search Performance
- Slow Filters
- Pagination Usage
- Popular Sort Fields
- Search Keywords

---

# Best Practices

- Paginate Every Collection Endpoint
- Limit Maximum Page Size
- Index Frequently Filtered Columns
- Use Full-Text Search Instead of Multiple LIKE Clauses
- Validate All Query Parameters
- Return Consistent Pagination Metadata
- Support Combined Filtering and Sorting
- Prefer Cursor Pagination for Large Datasets
- Document Every Supported Query Parameter
- Optimize Queries Using `EXPLAIN ANALYZE`

---

# Future Enhancements

- Cursor Pagination by Default
- Faceted Search
- Saved Filters
- Search Suggestions
- Elasticsearch / Meilisearch Integration
- AI Semantic Search
- Dynamic Filter Metadata
- Aggregation Endpoints
- Geo-Based Filtering
- Personalized Search Ranking