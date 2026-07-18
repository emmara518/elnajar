# CATALOG ARCHITECTURE

**Project:** TOKYO Packaging Commerce Platform  
**Status:** Domain Architecture — Pre-Implementation  
**Author:** Architecture Review  
**Date:** 2026-07-18

---

## Table of Contents

1. Catalog Philosophy
2. Taxonomy Strategy
3. Category Model
4. Subcategory Model
5. Product Family
6. Variant Dimensions
7. Variant Model
8. Packaging Units
9. Pricing Model
10. Inventory Model
11. Compatible Products
12. Cross Sell
13. Frequently Bought Together
14. Search Index Structure
15. Filtering Strategy
16. Product Identification Strategy
17. SKU Strategy
18. Barcode Strategy
19. SEO Strategy
20. URL Strategy
21. Data Relationships
22. Future Scalability

---

## DELIVERABLE #1: Catalog Philosophy

### What a Packaging Catalog IS

A packaging catalog is a **technical specification catalog** that happens to have prices attached. It is closer to an industrial parts catalog (e.g., McMaster-Carr, Grainger) than a consumer e-commerce store.

The primary unit of organization is not "products people want to buy" — it is **"items people need to operate a business."**

### What a Packaging Catalog IS NOT

It is not:
- A merchandising catalog (no seasonal fashion)
- A brand showcase (brands matter but as specs, not lifestyle)
- A discovery feed (no algorithmic recommendations)
- A content marketing platform (no editorial content)
- A social shopping experience (no reviews as primary signal)

### First Principles

1. **Completeness over curation** — A restaurant needs to find ALL the cup sizes they might use, not just "featured" cups.
2. **Precision over persuasion** — "12oz Paper Cup, White, Case/500" is the product. Marketing copy is secondary.
3. **Compatibility is structural** — A cup without a compatible lid is an incomplete order. Compatibility must be modeled as a first-class relationship, not a product recommendation.
4. **Bulk is the default** — These are not single-unit purchases. The default purchase quantity is a case, a box, or a pallet.
5. **Specifications are navigation** — Capacity, material, dimensions — these are not just product details, they are how customers find products.

### Mental Model

> A restaurant owner thinks: "I need 12oz hot cups with matching dome lids, wooden stirrers, and napkins — and I need them delivered by Thursday."

The catalog must support this **mission-based purchasing**, not "browsing for inspiration."

---

## DELIVERABLE #1 — Taxonomy Strategy

### Taxonomic Structure

The catalog uses a **polyhierarchical taxonomy** — any product family can live in multiple navigation paths.

```
Business Type Path:
  Restaurant Essentials
    → Hot Cups
    → Cold Cups
    → Lids
    → Napkins
    → Takeout Containers
    → Cutlery

  Coffee Shop Essentials
    → Hot Cups
    → Cold Cups
    → Lids
    → Stirrers
    → Sleeves
    → Syrups & Toppings

  Bakery Essentials
    → Bakery Boxes
    → Cake Boards
    → Bags
    → Trays
    → Doilies

  Catering Supplies
    → Serving Trays
    → Chafing Dishes
    → Buffet Supplies
    → Disposable Dinnerware

Product Type Path:
  Cups → Paper Cups, Plastic Cups, Foam Cups, Biodegradable Cups
  Lids → Plastic Lids, Paper Lids, Dome Lids, Flat Lids
  Containers → Foam Containers, Plastic Containers, Paper Containers, Aluminum
  Bags → Paper Bags, Plastic Bags, Biodegradable Bags
  Cutlery → Plastic Cutlery, Wooden Cutlery, Biodegradable Cutlery
  Napkins → Dispenser Napkins, Dinner Napkins, Guest Towels
  Straws → Plastic Straws, Paper Straws, Biodegradable Straws
  Gloves → Food Service Gloves, Cleaning Gloves
  Film & Wrap → Cling Film, Aluminum Foil, Parchment Paper
```

### Taxonomy Principles

1. **Every product family must have at least one primary category** — No orphaned products.
2. **Business type paths are derived views** — They are not real categories. They are curated collections of product families from multiple categories.
3. **Categories are stable** — The product type path rarely changes. Business type paths can be added/removed as market segments change.
4. **Depth is limited to 3 levels** — Category → Subcategory → ProductFamily. No deeper nesting. This ensures the 3-click rule to any variant.

---

## DELIVERABLE #1 — Category Model

### Category (Entity)

```
Category {
  id: string (UUID)
  name: string (Arabic + English)
  slug: string (URL-safe, English-based)
  description: string
  imageUrl?: string (icon only, no lifestyle imagery)
  iconName?: string (Lucide icon reference)
  parentId?: string (nullable, self-referential for hierarchy)
  sortOrder: number
  isActive: boolean
  displayInNavigation: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### Category Constraints (Invariants)

- A category cannot be its own parent.
- Circular parent references are forbidden.
- A category with active product families cannot be deactivated — soft-deactivate by marking product families first.
- Maximum depth: 2 levels (Category → Subcategory). ProductFamilies live at Subcategory level.

### Category Types

There are two types of categories:

1. **Structural Categories** — Map to real product taxonomy. These are what customers navigate by product type.
   - Examples: Cups, Lids, Containers, Bags, Cutlery, Napkins, Straws

2. **Business Segment Categories** — Map to industry verticals. These are curated groupings.
   - Examples: Restaurant Essentials, Coffee Shop Essentials, Bakery Essentials
   - These are implemented as **Collections** (see below), not as real categories in the taxonomy tree.

---

## DELIVERABLE #1 — Subcategory Model

### Subcategory (Entity)

```
Subcategory {
  id: string (UUID)
  categoryId: string (FK → Category)
  name: string (Arabic + English)
  slug: string
  description: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  displayInNavigation: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### Subcategory Examples

| Category | Subcategory Examples |
|----------|---------------------|
| Cups | Paper Cups, Plastic Cups, Foam Cups, Biodegradable Cups, Reusable Cups |
| Lids | Plastic Lids, Paper Lids, Dome Lids, Flat Lids, Sipper Lids |
| Containers | Foam Containers, Plastic Containers, Paper Containers, Aluminum Containers, Compostable Containers |
| Bags | Paper Bags (Kraft), Plastic Bags (T-shirt), Poly Bags, Biodegradable Bags, Gift Bags |
| Cutlery | Forks, Spoons, Knives, Sporks, Stirrers, Wooden Cutlery, Plastic Cutlery |

### Subcategory Invariants

- A subcategory belongs to exactly one category.
- A subcategory with active product families cannot be deactivated.
- Subcategory names must be unique within a category.

---

## DELIVERABLE #1 — Product Family

This is the most important concept in the domain. A **ProductFamily** is NOT a product — it is a **product line** that shares a common concept, material, and use case.

### ProductFamily (Entity — Aggregate Root)

```
ProductFamily {
  id: string (UUID)
  subcategoryId: string (FK → Subcategory)
  name: string (Arabic + English)
  slug: string
  description: string (technical description)
  shortDescription: string (one line for cards)
  brandId?: string (FK → Brand)
  manufacturer?: string
  material: string (primary material)
  materialDescription: string (human readable, e.g., "High-quality kraft paper with PE lining")
  foodSafe: boolean
  microwaveSafe: boolean
  ovenSafe: boolean
  freezerSafe: boolean
  ecoFriendly: boolean
  biodegradable: boolean
  compostable: boolean
  recycledContent: boolean
  recycledContentPercentage?: number
  features: string[] (key bullet points)
  certifications: string[] (FDA, ISO, etc.)
  defaultImageUrl: string
  images: ProductImage[]
  sortOrder: number
  status: ProductFamilyStatus
  seoTitle?: string
  seoDescription?: string
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### ProductFamily Concepts

- **A ProductFamily defines "what" the product is.** (e.g., "Kraft Paper Cup")
- **A ProductFamily owns its variant dimensions.** (capacity, color, size)
- **A ProductFamily owns compatibility relationships.** (this cup family is compatible with these lid families)
- **A ProductFamily owns technical specifications.** (material, features, certifications)
- **A ProductFamily does NOT have a price.** Only Variants with PackagingUnits have prices.
- **A ProductFamily does NOT have inventory.** Only Variants with PackagingUnits have inventory.

### ProductFamily Status (Lifecycle)

```
DRAFT → PENDING_REVIEW → PUBLISHED → DISCONTINUED → ARCHIVED
                                ↑                         |
                                └── REINSTATED ←──────────┘
```

- **DRAFT**: Being created, not visible to customers.
- **PENDING_REVIEW**: Submitted for approval, not yet visible.
- **PUBLISHED**: Visible in catalog, variants can be sold.
- **DISCONTINUED**: No longer manufactured/restocked, existing stock can still sell out.
- **ARCHIVED**: Fully removed from catalog, no sales possible.
- **REINSTATED**: Archived family brought back.

---

## DELIVERABLE #1 — Variant Dimensions

This is where the real complexity lives. A packaging product can vary along multiple independent dimensions.

### VariantDimension (Entity)

```
VariantDimension {
  id: string (UUID)
  productFamilyId: string (FK → ProductFamily)
  name: string (Arabic + English) — e.g., "Capacity", "Color", "Size"
  slug: string — e.g., "capacity", "color", "size"
  dimensionType: VariantDimensionType
  sortOrder: number
  isRequired: boolean
}
```

### VariantDimensionType

```
VariantDimensionType = 'capacity' | 'color' | 'size' | 'material' | 'shape' | 'design'
```

### VariantDimensionValue (Entity)

```
VariantDimensionValue {
  id: string (UUID)
  dimensionId: string (FK → VariantDimension)
  value: string (Arabic + English) — e.g., "8 oz", "12 oz", "White", "Brown"
  slug: string — e.g., "8-oz", "white"
  sortOrder: number
  metadata: Record<string, string> — e.g., { "ml": "237", "diameter_mm": "80", "height_mm": "90" }
}
```

### Concrete Example

**ProductFamily**: Kraft Paper Cup  
**Dimensions**:
- Capacity (required): 8oz, 12oz, 16oz, 20oz, 24oz
- Color (required): White, Brown, Custom Printed
- Design (optional): Plain, Polka Dot, Striped, Custom

**ProductFamily**: Plastic Dome Lid  
**Dimensions**:
- Size (required): Fits 8oz, Fits 12oz, Fits 16oz, Fits 20oz
- Material (required): Clear PET, Black PET, Biodegradable PLA
- Type (required): Dome, Flat, Sipper

### Dimension Invariants

- Each dimension value must be unique within a dimension.
- A variant must have exactly one value for each required dimension.
- Dimensions can be added to a product family even after variants exist (new variants become available).
- Removing a dimension that has active variants is forbidden. Soft-deactivate by marking variants non-sellable.

---

## DELIVERABLE #1 — Variant Model

A **Variant** is a specific combination of dimension values. This is the closest thing to the current "Product" concept.

### Variant (Entity)

```
Variant {
  id: string (UUID)
  productFamilyId: string (FK → ProductFamily)
  sku: SKU (value object)
  barcode?: Barcode (value object)
  name: string (Arabic + English — auto-generated from dimensions)
  slug: string (auto-generated)
  dimensionValues: VariantDimensionValue[] (the specific combination)
  specifications: Specification[] (variant-specific specs that override or add to family specs)
  defaultImageUrl: string
  images: ProductImage[]
  isActive: boolean
  status: VariantStatus
  sortOrder: number
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### Variant Naming Convention

Auto-generated from dimensions:
```
"{ProductFamily Name} — {dim1.value}, {dim2.value}, {dim3.value}"
  → "Kraft Paper Cup — 12oz, White, Plain"
  → "Plastic Dome Lid — Fits 12oz, Clear PET, Dome"
```

### Variant Uniqueness

- The combination of `(productFamilyId + dimensionValues)` must be unique.
- Two variants in the same family cannot have the same dimension value combination.
- SKU is globally unique.

### Variant vs SKU

A **Variant** is the product definition. A **SKU** is the identifier. They are 1:1 at this level.

However, a single variant can be sold in multiple **Packaging Units** (see below). This is where 1:1 breaks — one variant can have multiple packaging units, each potentially with its own barcode.

### Variant Status (Lifecycle)

```
DRAFT → AVAILABLE → LOW_STOCK → OUT_OF_STOCK → DISCONTINUED
                         ↑           |
                         └── RESTOCKED ←───┘
```

- **DRAFT**: Created but not sellable.
- **AVAILABLE**: In stock and sellable.
- **LOW_STOCK**: Stock below threshold. Still sellable.
- **OUT_OF_STOCK**: No stock. Not sellable until restocked.
- **DISCONTINUED**: Permanently discontinued. No longer sold.
- **RESTOCKED**: Transition from OUT_OF_STOCK back to AVAILABLE (with stock update).

---

## DELIVERABLE #1 — Packaging Units

This is the most important concept that a generic e-commerce model misses. A packaging product is almost always sold in **multiples** — and the multiple itself has identity.

### PackagingUnit (Entity)

```
PackagingUnit {
  id: string (UUID)
  variantId: string (FK → Variant)
  unitType: UnitType
  quantity: number (how many individual items in this unit)
  label: string (Arabic + English) — e.g., "Case of 500", "Box of 1000"
  barcode?: Barcode (EAN-13 for the unit itself, different from variant barcode)
  weight?: number (kg/lbs)
  weightUnit?: string
  dimensions?: { length: number, width: number, height: number, unit: string }
  isDefault: boolean (which unit shows first in UI)
  isActive: boolean
  sortOrder: number
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### UnitType

```
UnitType = 'piece' | 'pack' | 'sleeve' | 'box' | 'case' | 'carton' | 'pallet'
```

### Concrete Examples

| Variant | Unit 1 | Unit 2 | Unit 3 |
|---------|--------|--------|--------|
| Kraft Paper Cup 12oz | Sleeve/50 | Case/500 | Pallet/10,000 |
| Plastic Lid (Fits 12oz) | Pack/100 | Case/1000 | Pallet/20,000 |
| Wooden Stirrer | Box/500 | Case/5,000 | Case/10,000 |
| Dispenser Napkin | Pack/100 | Case/2,000 | Pallet/40,000 |

### PackagingUnit Invariants

- A variant must have at least one active packaging unit (or it is not sellable).
- Exactly one packaging unit per variant should be marked `isDefault`.
- `quantity` must be a positive integer.
- UnitType captures the container type; quantity captures the count.
- A packaging unit's barcode is typically the EAN-13 that a distributor or warehouse scans. This is different from the variant's SKU.

---

## DELIVERABLE #1 — Pricing Model

### Price (Entity)

```
Price {
  id: string (UUID)
  packagingUnitId: string (FK → PackagingUnit)
  priceType: PriceType
  amount: Money (value object)
  minQuantity?: number (minimum order quantity for this price tier)
  maxQuantity?: number (maximum quantity for this price tier)
  validFrom?: DateTime
  validTo?: DateTime
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### PriceType

```
PriceType = 'list' | 'wholesale' | 'promotional' | 'clearance'
```

### Pricing Model Strategy

**Tiered Pricing is the default**, not the exception. Every packaging unit should support multiple price tiers:

| Unit | Qty Range | Price/Unit |
|------|-----------|------------|
| Case/500 (12oz Cups) | 1-5 cases | SAR 45.00/case |
| Case/500 (12oz Cups) | 6-20 cases | SAR 42.00/case |
| Case/500 (12oz Cups) | 21+ cases | SAR 38.00/case |

### Pricing Invariants

- Each packaging unit must have at least one list price.
- Price tiers cannot overlap in quantity ranges.
- Promotional prices must have a `validTo` date.
- A historical price record must be kept immutable for order reconciliation. Never delete a price — mark it superseded.

### Per-Unit Price Display

Always display both:
1. **Unit price**: Price per individual item (e.g., SAR 0.09/cup)
2. **Package price**: Price per packaging unit (e.g., SAR 45.00/case)

---

## DELIVERABLE #1 — Inventory Model

### Inventory (Entity — closely tied to the existing InventoryItem)

```
Inventory {
  id: string (UUID)
  packagingUnitId: string (FK → PackagingUnit)
  branchId: string (FK → Branch)
  quantityOnHand: number
  quantityCommitted: number (allocated to open orders)
  quantityAvailable: number (calculated: onHand - committed)
  lowStockThreshold: number
  reorderPoint: number
  reorderQuantity: number
  location?: string (warehouse aisle/bin)
  lastCountedAt?: DateTime
  updatedAt: DateTime
}
```

### Inventory Invariants

- `quantityAvailable = quantityOnHand - quantityCommitted` (invariant, calculated always).
- `quantityOnHand` can only change via StockMovement events.
- `quantityCommitted` can only change via order lifecycle events.
- `quantityAvailable` must never go below 0. If it would, the order fulfillment process blocks.
- Low stock alerts trigger when `quantityAvailable <= lowStockThreshold`.

### Stock Status Derivation

Stock status is **derived**, not stored directly:

```
quantityAvailable = 0                         → OUT_OF_STOCK
quantityAvailable > 0 AND <= lowStockThreshold → LOW_STOCK
quantityAvailable > lowStockThreshold          → IN_STOCK
```

---

## DELIVERABLE #1 — Compatible Products

### Compatibility (Entity — First-Class Domain Concept)

```
Compatibility {
  id: string (UUID)
  sourceProductFamilyId: string (FK → ProductFamily)
  targetProductFamilyId: string (FK → ProductFamily)
  compatibilityType: CompatibilityType
  directionality: Directionality
  description: string (Arabic + English)
  validationRule?: CompatibilityValidationRule
  isActive: boolean
  sortOrder: number
  createdAt: DateTime (immutable)
  updatedAt: DateTime
}
```

### CompatibilityType

```
CompatibilityType =
  | 'fits'          — Lid fits cup, sleeve fits cup
  | 'contains'      — Container fits in tray, box fits in bag
  | 'pairs_with'    — Straw pairs with cup, stirrer pairs with cup
  | 'required_for'  — Lid is required for takeaway cup
  | 'alternative'   — Alternative product choice
  | 'accessory'     — Supplementary item
```

### Directionality

```
Directionality = 'directed' | 'bidirectional'
```

- **Directed**: Lid `fits` Cup (but Cup does not fit Lid).
- **Bidirectional**: Napkin `pairs_with` Cutlery (both directions make sense).

### CompatibilityValidationRule

```
CompatibilityValidationRule {
  ruleType: 'dimension_match' | 'family_match' | 'manual'
  sourceDimensionId?: string
  targetDimensionId?: string
  valueMappings?: { sourceValue: string, targetValue: string }[]
}
```

### Example Compatibility Rules

| Source Family | Target Family | Type | Rule |
|--------------|--------------|------|------|
| Kraft Paper Cup 12oz | Dome Lid (Fits 12oz) | fits | dimension_match: Cup.capacity = Lid.fits_size |
| Kraft Paper Cup 12oz | Cup Sleeve (12oz) | fits | dimension_match: Cup.capacity = Sleeve.size |
| Soup Container 16oz | Soup Lid (16oz) | required_for | family_match |
| Kraft Paper Cup 12oz | Wooden Stirrer | pairs_with | manual (always compatible) |
| Carry Tray (4-cup) | Kraft Paper Cup 12oz | contains | dimension_match: Tray.capacity >= Cup.capacity |

### Compatibility Ownership

- **Compatibility is owned by the source ProductFamily**, not by individual variants.
- However, rules can reference specific dimension values.
- When a compatibility is created, it applies to all variants of both families (subject to validation rules filtering).
- Compatibilities are created by catalog managers, not auto-generated (except through dimension validation rules).

### Validation

When a customer adds items to cart:

1. **Pull all compatibilities** for the product families in the cart.
2. **Check each validity rule** against the specific variants selected.
3. **Surface suggestions**: "You added Kraft Paper Cup 12oz. A matching dome lid is available."
4. **Surface warnings**: "The lids in your cart (Plastic Lid Fits 16oz) may not fit the cups you selected (Kraft Paper Cup 12oz)."
5. **Block incompatible configurations** if `required_for` compatibility is violated.

### Future Automation

- **Auto-suggest compatible items at checkout** based on order contents.
- **Compatibility-aware search**: "lids for 12oz cups" should show only lids with compatibility rule targeting 12oz cups.
- **Bulk compatibility creation**: When a new cup family is added, auto-create compatibility rules with existing lid families based on dimension matching.
- **Machine learning** (future): Learn which products are frequently ordered together and suggest new compatibility rules.

---

## DELIVERABLE #1 — Cross Sell

### CrossSellStrategy (Entity)

```
CrossSellStrategy {
  id: string (UUID)
  sourceProductFamilyId: string (FK → ProductFamily)
  targetProductFamilyId: string (FK → ProductFamily)
  strategyType: CrossSellType
  priority: number
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### CrossSellType

```
CrossSellType =
  | 'complete_the_order'   — "You also need lids for those cups"
  | 'frequently_bought'    — Manual curation based on order data
  | 'volume_upgrade'       — "Save more by buying in bulk"
  | 'category_complement'  — "Customers who bought cups also bought napkins"
  | 'seasonal'             — Seasonal cross-sell
  | 'promotional'          — Active promotion cross-sell
```

### Cross Sell vs Compatibility

| Relationship | Compatibility | Cross Sell |
|-------------|---------------|------------|
| Nature | Structural (true/false) | Behavioral (suggestion) |
| Validation | Can block orders | Never blocks |
| Lifecycle | Permanent | Can change frequently |
| Automation | Dimension-based rules | Order history / ML |
| Cardinality | ProductFamily → ProductFamily | ProductFamily → ProductFamily |

---

## DELIVERABLE #1 — Frequently Bought Together

### FrequentlyBoughtTogether (Derived/Computed, not stored as entity)

Frequently Bought Together is a **derived relationship**, computed from order history.

### Algorithm

```
Frequently Bought Together:
  For any set of product families A, B, C:
    confidence = orders_containing_all / orders_containing_any
    support = orders_containing_all / total_orders

  Display when:
    confidence >= 0.15 (15%) AND
    support >= 0.01 (1% of orders)
```

### Implementation Notes

- This is computed periodically (daily batch), not real-time.
- Results are cached.
- Only PUBLISHED product families are considered.
- Results are filtered: only show if the combination makes business sense (a catalog manager can override or block specific combinations).
- In early stages (no order history), this can be seeded with manually curated relationships.

---

## DELIVERABLE #1 — Search Index Structure

Search is the primary interaction model. It must understand packaging industry language.

### Indexed Document Structure (for each Variant + PackagingUnit combination)

```
SearchDocument {
  id: string (derived from variantId + packagingUnitId)

  // Identity
  sku: string
  barcode: string
  familyName_ar: string
  familyName_en: string
  variantName_ar: string
  variantName_en: string
  brandName: string
  manufacturer: string

  // Category Path
  categoryName_ar: string
  categoryName_en: string
  subcategoryName_ar: string
  subcategoryName_en: string

  // Specs (indexed as both text and numeric ranges)
  capacity_oz: number
  capacity_ml: number
  material_ar: string
  material_en: string
  color_ar: string
  color_en: string
  shape_ar: string
  shape_en: string
  diameter_mm: number
  height_mm: number
  length_mm: number
  width_mm: number
  weight_g: number
  temperature_range: string

  // Packaging Unit
  packagingUnitType: string
  packagingUnitQuantity: number
  packagingUnitLabel_ar: string
  packagingUnitLabel_en: string

  // Pricing (lowest available)
  price_per_unit: number
  price_per_package: number
  currency: string

  // Stock
  isInStock: boolean
  stockStatus: string

  // Features & Certifications
  isFoodSafe: boolean
  isMicrowaveSafe: boolean
  isEcoFriendly: boolean
  isBiodegradable: boolean
  features_ar: string[]
  features_en: string[]
  certifications: string[]

  // Compatibility
  compatibleWithFamilyIds: string[]
  compatibleWithFamilyNames: string[]

  // Boost/rank signal
  isPromoted: boolean
  isNewArrival: boolean
  popularityScore: number (derived from order count)
  sortOrder: number (catalog manager override)
}
```

---

## DELIVERABLE #1 — Filtering Strategy

### Primary Filters (always shown)

| Filter | Type | Source |
|--------|------|--------|
| Category | Tree navigation | Category hierarchy |
| Subcategory | List | Subcategory list |
| Capacity | Range slider + preset buttons | VariantDimensionValue.metadata (ml) |
| Material | Multi-select | VariantDimensionValue (material) |
| Brand | Multi-select | ProductFamily.brandId |
| Packaging Unit | Single-select | PackagingUnit.unitType |
| Price Range | Range slider | Price.amount |
| Stock Status | Single-select | Derived from Inventory |

### Secondary Filters (expandable)

| Filter | Type | Source |
|--------|------|--------|
| Color | Multi-select chips | VariantDimensionValue (color) |
| Shape | Multi-select | VariantDimensionValue (shape) |
| Diameter (mm) | Range slider | VariantDimensionValue.metadata |
| Height (mm) | Range slider | VariantDimensionValue.metadata |
| Weight (g) | Range slider | ProductFamily / PackagingUnit |
| Temperature Resistance | Tags | ProductFamily.certifications |
| Food Safe | Toggle | ProductFamily.foodSafe |
| Microwave Safe | Toggle | ProductFamily.microwaveSafe |
| Freezer Safe | Toggle | ProductFamily.freezerSafe |
| Eco Friendly | Toggle | ProductFamily.ecoFriendly |
| Biodegradable | Toggle | ProductFamily.biodegradable |
| Compostable | Toggle | ProductFamily.compostable |
| Recycled Content | Toggle | ProductFamily.recycledContent |
| Certified | Multi-select | ProductFamily.certifications |
| Promotion | Single-select | Price.priceType = 'promotional' |

### Filtering Interaction with Search

1. If the user searches "12oz paper cup", the search returns results.
2. The filters show **facet counts** for the current result set (e.g., Material: Paper (42), PLA (8), Foam (3)).
3. When a filter is applied, results are re-filtered WITHOUT re-querying search (client-side or via API with filter parameters).
4. Filtering and sorting combine: filtered results are then sorted by the selected sort criteria.
5. URL state tracks both query and active filters: `/search?q=12oz+paper+cup&material=paper&capacity_min=8&capacity_max=16`.

---

## DELIVERABLE #1 — Product Identification Strategy

### Identification Layers

| Level | Identifier | Scope | Example |
|-------|-----------|-------|---------|
| ProductFamily | Family ID (UUID) | Global | `fam_2x8k9m3n` |
| ProductFamily | Family Slug | Unique | `kraft-paper-cup` |
| Variant | Variant SKU | Global | Same as SKU |
| Variant | Variant Slug | Unique within family | `12oz-white-plain` |
| PackagingUnit | Unit ID (UUID) | Global | `unit_4y7p1q2r` |

---

## DELIVERABLE #1 — SKU Strategy

### SKU Format

```
SKU = {Category Code}{Subcategory Code}{Brand Code}{Material Code}{Capacity Code}{Color Code}{Pack Type}
```

**Example**: `CP-PC-KF-PR-12-WH-C5`

| Segment | Code | Meaning |
|---------|------|---------|
| Category | CP | Cups |
| Subcategory | PC | Paper Cups |
| Brand | KF | Kraft |
| Material | PR | Paper |
| Capacity | 12 | 12oz |
| Color | WH | White |
| Pack | C5 | Case of 500 |

### SKU Rules

- Alphanumeric, uppercase.
- Between 8 and 30 characters.
- Globally unique.
- The SKU is the **variant-level identifier**, not the packaging-unit-level identifier.
- A variant's SKU never changes after creation.
- A variant that is discontinued must keep its SKU for historical order reconciliation.

---

## DELIVERABLE #1 — Barcode Strategy

### Barcode Assignment

| Level | Barcode Type | Purpose |
|-------|-------------|---------|
| Variant | None (not typically scanned) | Internal reference |
| PackagingUnit | EAN-13 (or UPC-A for North America) | Scanned at warehouse/distribution |
| PackagingUnit (Pallet) | ITF-14 (if needed) | Logistics scanning |

### Barcode Rules

- One barcode per PackagingUnit (not per variant).
- A single variant with 3 packaging units has up to 3 barcodes.
- Barcodes are globally unique.
- When a packaging unit changes (e.g., case quantity changes), the barcode changes.
- Historical barcodes are retained for order matching.

---

## DELIVERABLE #1 — SEO Strategy

### SEO Principles for Packaging

- **Search intent is transactional/technical**, not informational/emotional. No lifestyle content.
- **Primary keywords**: Capacity + Material + Product Type (e.g., "12oz paper cup", "kraft food container")
- **Secondary keywords**: Business use + Product (e.g., "restaurant takeout cups", "coffee shop lids")
- **Long tail**: Specific SKUs, part numbers, barcodes.

### Per-Page SEO

| Page Type | Meta Title Pattern | Meta Description Pattern |
|-----------|-------------------|------------------------|
| Category | "{Category Name} — Packaging Supplies" | "Shop {category name} for restaurants, cafés, and bakeries. Available in various sizes, materials, and bulk quantities." |
| ProductFamily | "{Family Name} — {Brand} | {Category}" | "{Family name} in multiple sizes. {Material}. Food safe. Available in bulk cases. ✓ Fast delivery across KSA." |
| Variant | "{Variant Name} — {SKU}" | "{Variant description}. Pack of {packaging unit}. {Stock status}. Order now for next-day delivery." |

### Structured Data (JSON-LD)

Every product family page should output:

```
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Kraft Paper Cup — 12oz",
  "description": "High-quality kraft paper cup with PE lining",
  "sku": "CP-PC-KF-PR-12-WH-C5",
  "gtin13": "0623001234567",
  "brand": { "@type": "Brand", "name": "Kraft" },
  "category": "Cups > Paper Cups",
  "material": "Paper",
  "offers": {
    "@type": "Offer",
    "price": "45.00",
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31"
  }
}
```

---

## DELIVERABLE #1 — URL Strategy

### URL Structure

```
/                                            — Dashboard (browsing hub)
/categories                                  — Category listing
/categories/{subcategory-slug}               — Subcategory page (list of product families)
/categories/{subcategory-slug}/{family-slug}  — Product family detail (variants, specs, compatibilities)

/search?q={query}                            — Search results
/search?q={query}&filter=...                 — Search with filters

/products/{variant-slug}                     — Variant detail / purchase page

/collections                                 — Business collections listing
/collections/{collection-slug}               — Collection detail

/brands                                      — Brand listing
/brands/{brand-slug}                         — Brand detail showing all families

/cart                                        — Cart
/orders                                      — Order history
/orders/{order-id}                           — Order detail
/account                                     — Business account
```

### URL Rules

- All slugs are lowercase with hyphens.
- Slugs are English-based for URL cleanliness. Arabic content is handled via RTL rendering, not URL translation.
- Product family slugs are unique across the entire catalog (not just within subcategory).
- Search parameters use `q` for query, `filter` as a pipe-delimited key=value string.
- Pagination: `?page=2&limit=24`.

---

## DELIVERABLE #1 — Data Relationships

### Entity Relationship Summary

```
Category (1) ──< (N) Subcategory
Subcategory (1) ──< (N) ProductFamily
ProductFamily (1) ──< (N) VariantDimension
ProductFamily (1) ──< (N) Variant
ProductFamily (1) ──< (N) Compatibility (source)
ProductFamily (1) ──< (N) CrossSellStrategy (source)
ProductFamily (N) >── (N) ProductFamily (via Compatibility)
VariantDimension (1) ──< (N) VariantDimensionValue
Variant (1) ──< (N) VariantDimensionValue (through join)
Variant (1) ──< (N) PackagingUnit
PackagingUnit (1) ──< (N) Price
PackagingUnit (1) ──< (N) Inventory
Brand (1) ──< (N) ProductFamily
Collection (N) >── (N) ProductFamily (many-to-many)
```

### What Can Change Independently

| Change | Entity Affected | Approval Needed |
|--------|----------------|-----------------|
| Add new category | Category | Product manager |
| Add new subcategory | Subcategory | Product manager |
| Add new product family | ProductFamily | Catalog manager |
| Add dimension to family | VariantDimension | Catalog manager |
| Add variant | Variant | Catalog manager |
| Change price | Price | Pricing manager |
| Update inventory | Inventory | Warehouse system (automated) |
| Add compatibility | Compatibility | Catalog manager |
| Update certification | ProductFamily | Quality assurance |
| Deactivate variant | Variant | Catalog manager |
| Add collection | Collection | Marketing manager |

### What Must Stay Immutable

- **AuditLog entries** — All changes must be traceable.
- **Order prices** — The price at time of order must be preserved in the order line item, not looked up from current price.
- **Order items** — Once confirmed, the specific variant and packaging unit references must not change.
- **Variant SKU** — Never changes after creation.
- **StockMovement records** — Immutable log of every inventory change.
- **Historical price records** — Mark superseded, never delete.

---

## DELIVERABLE #1 — Future Scalability

### Catalog Size Projections

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| Categories | 10-15 | 25-40 | 50-80 |
| Subcategories | 40-60 | 100-200 | 300-500 |
| Product Families | 100-200 | 500-1,000 | 2,000-5,000 |
| Variants | 500-1,500 | 3,000-10,000 | 15,000-50,000 |
| Packaging Units | 1,000-4,000 | 6,000-25,000 | 30,000-120,000 |
| Prices | 3,000-12,000 | 18,000-100,000 | 90,000-500,000 |
| Compatibilities | 300-1,000 | 2,000-10,000 | 10,000-50,000 |

### Performance Implications

- **Variant resolution** — Joining a variant to its dimension values to its family should be a single query (eager loading or denormalized view).
- **Variant query pattern** — Most queries filter by dimension values (capacity, material, color). These need indexes or a dedicated search index.
- **Compatibility traversal** — When showing a product family, we need all compatible families. This is a graph traversal. At scale (>5K families), consider a graph database or materialized adjacency list.
- **Price lookups** — Price at scale is table-scans unless indexed by (packagingUnitId, priceType, validFrom, validTo).

### Scaling Strategy

1. **Year 1**: Relational database with indexed variant dimension values. Compatibilities loaded eagerly per family.
2. **Year 2-3**: Read replicas for catalog queries. Search as primary navigation (reduce direct DB queries).
3. **Year 3+**: Consider dedicated search service (Algolia/Meilisearch/Typesense). Compatibility graph moves to dedicated store. Variant dimension queries served from search index.

---

## DELIVERABLE #2: Domain Model

### Aggregate Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                    CATALOG CONTEXT                       │
│                                                         │
│  [Category Aggregate]     [Subcategory Aggregate]        │
│  Root: Category           Root: Subcategory             │
│  Owns: —                  Owns: —                       │
│  Invariant: Tree depth    Invariant: Belongs to         │
│  max 2                   one category                   │
│                                                         │
│  [ProductFamily Aggregate]       [Brand Aggregate]       │
│  Root: ProductFamily             Root: Brand            │
│  Owns: VariantDimension,         Owns: —                │
│        Compatibility,                                    │
│        CrossSellStrategy                                 │
│  Invariants: Has at least one                           │
│  subcategory. Can have 0+                               │
│  dimensions.                                            │
│                                                         │
│  [Variant Aggregate]              [PackagingUnit Agg.]   │
│  Root: Variant                    Root: PackagingUnit    │
│  Owns: —                          Owns: Price           │
│  Invariant: Must reference        Invariant: Must have   │
│  one value per required           at least one price    │
│  dimension of parent family                             │
│                                                         │
│  [Inventory Aggregate]                                  │
│  Root: Inventory (per branch)                           │
│  Owns: StockMovement (immutable)                        │
│  Invariant: qtyAvailable =                              │
│  qtyOnHand - qtyCommitted                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   ORDERING CONTEXT                      │
│  [Sale Aggregate] — Already designed, packaging-ready   │
│  [Collection Aggregate] — New for business collections  │
└─────────────────────────────────────────────────────────┘
```

### Aggregate Responsibilities

#### Category Aggregate
- **Responsibility**: Organize the catalog tree. Provide navigation structure.
- **Lifecycle**: Created by admin. Rarely changes after creation.
- **Concurrency**: Low contention. Optimistic locking sufficient.

#### Subcategory Aggregate
- **Responsibility**: Group product families within a category.
- **Lifecycle**: Created by admin. Changes when category structure changes.
- **Concurrency**: Low contention.

#### ProductFamily Aggregate (Core)
- **Responsibility**: Define a product line, its variant dimensions, compatible products, and cross-sell rules.
- **Lifecycle**: Draft → Published → Discontinued → Archived.
- **Concurrency**: Moderate (catalog managers may edit simultaneously). Optimistic locking on version field.
- **Invariants**:
  - Must reference an active subcategory.
  - Must have at least one required variant dimension.
  - Compatibilities must reference other active product families.
  - Cannot be archived while active variants exist (must discontinue variants first).

#### Variant Aggregate
- **Responsibility**: Represent a specific combination of dimension values within a product family.
- **Lifecycle**: Draft → Available → OutOfStock → Discontinued.
- **Concurrency**: Low. Created during catalog setup, changes only for status updates.
- **Invariants**:
  - Must have exactly one dimension value per required dimension of parent family.
  - SKU must be unique across all variants.
  - Must have at least one active packaging unit to be sellable.
  - Cannot exist without an active parent product family.

#### PackagingUnit Aggregate
- **Responsibility**: Define how a variant is sold (quantity, unit type, pricing).
- **Lifecycle**: Created when a new pack size is needed. Deactivated when no longer sold.
- **Concurrency**: Low. Pricing changes are infrequent.
- **Invariants**:
  - Must reference an active variant.
  - Must have at least one active price.
  - Quantity must be a positive integer.
  - Cannot be deleted if referenced by any order (soft-deactivate only).

#### Brand Aggregate
- **Responsibility**: Represent a supplier/manufacturer.
- **Lifecycle**: Created when a new brand is sourced. Rarely changes.
- **Invariants**: Name must be unique.

#### Inventory Aggregate
- **Responsibility**: Track stock levels per packaging unit per branch.
- **Lifecycle**: Continuously updated by stock movements.
- **Concurrency**: HIGH. Must use pessimistic locking or serializable isolation for stock deduction.
- **Invariants**:
  - quantityOnHand ≥ quantityCommitted always (quantityAvailable ≥ 0).
  - StockMovement records are immutable.

---

## DELIVERABLE #3: Database Architecture

### Entities (Conceptual Schema)

| Entity | Exists? | Why It Exists | Change Independence | Immutable |
|--------|---------|---------------|-------------------|-----------|
| Category | Yes | Taxonomical organization | Independent | Category ID |
| Subcategory | Yes | Group families within category | Depends on Category | Subcategory ID |
| Brand | Yes | Supplier identity | Independent | Brand ID |
| ProductFamily | NEW | Product line with specs and compatibilities | Depends on Subcategory | Family ID, Slug |
| VariantDimension | NEW | Define variation axes for a family | Depends on ProductFamily | Dimension ID |
| VariantDimensionValue | NEW | Possible values for a dimension | Depends on Dimension | Value ID |
| Variant (replaces Product) | NEW | Specific SKU-able item | Depends on Family + Values | Variant ID, SKU |
| PackagingUnit | NEW | How a variant is packaged for sale | Depends on Variant | Unit ID |
| Price | NEW | Price per packaging unit | Depends on PackagingUnit | Price ID (keep history) |
| Inventory (enhances existing) | EXIST | Stock per unit per branch | Depends on PackagingUnit + Branch | StockMovement records |
| StockMovement | EXIST | Immutable stock change log | Depends on Inventory | All fields |
| Compatibility | NEW | Structural relationship between families | Depends on two Families | Compatibility ID |
| CrossSellStrategy | NEW | Curated cross-sell rules | Depends on two Families | Strategy ID |
| Collection | NEW (Future) | Curated business segment grouping | Independent | Collection ID |
| CollectionItem | NEW (Future) | ProductFamily in a collection | Depends on Collection + Family | Item ID |
| Specification | NEW | Technical attribute on family/variant | Depends on Family or Variant | Spec ID |

### Conceptual Relationships (No SQL)

```
CATEGORY
  │
  ├──< SUBCATEGORY (1:N)
  │       │
  │       └──< PRODUCT_FAMILY (1:N)
  │               │
  │               ├──< VARIANT (1:N)
  │               │       │
  │               │       └──< PACKAGING_UNIT (1:N)
  │               │               │
  │               │               ├──< PRICE (1:N) — historical
  │               │               │
  │               │               └──< INVENTORY (1:N per branch)
  │               │
  │               ├──< VARIANT_DIMENSION (1:N)
  │               │       │
  │               │       └──< VARIANT_DIMENSION_VALUE (1:N)
  │               │
  │               ├──< COMPATIBILITY (source) (1:N)
  │               │       │
  │               │       └──> PRODUCT_FAMILY (target) (N:1)
  │               │
  │               └──< CROSS_SELL_STRATEGY (source) (1:N)
  │
  BRAND ──< PRODUCT_FAMILY (1:N)
```

### Variant to Dimension Resolution

The critical join: how a variant knows which dimension values it has.

```
VARIANT                    VARIANT_DIMENSION_VALUE
┌──────────┐               ┌──────────────────────┐
│ id       │────<──────────│ variant_id           │
│ family_id│               │ dimension_value_id    │
└──────────┘               └──────────────────────┘

VARIANT_DIMENSION          VARIANT_DIMENSION_VALUE
┌──────────┐               ┌──────────────────────┐
│ id       │────<──────────│ dimension_id         │
│ family_id│               │ value                 │
└──────────┘               │ metadata              │
                            └──────────────────────┘
```

### Change Independence Summary

| Change | Entities Touched |
|--------|-----------------|
| Add new variant dimension | VariantDimension only |
| Add new value to dimension | VariantDimensionValue only |
| Add new variant (new combination) | Variant + join records |
| Change price temporarily | Price (new record, old kept) |
| Change inventory | StockMovement (immutable) → Inventory (updated) |
| Deactivate product family | ProductFamily.status → cascades to Variant.status |
| Add compatibility | Compatibility only |
| Remove dimension | Blocked if any active variant uses it |

---

## DELIVERABLE #4: Product Lifecycle

### ProductFamily Lifecycle

```
        ┌────────────────────────────────────────────────────────┐
        │                                                        │
        v                                                        │
    ┌────────┐     ┌─────────────────┐     ┌──────────────┐      │
    │ DRAFT  │────>│ PENDING_REVIEW  │────>│  PUBLISHED   │      │
    └────────┘     └─────────────────┘     └──────────────┘      │
        │                                    │        │          │
        │                                    │        v          │
        │                                    │  ┌──────────────┐ │
        │                                    │  │ DISCONTINUED │ │
        │                                    │  └──────────────┘ │
        │                                    │        │          │
        │                                    │        v          │
        │                                    │  ┌──────────────┐ │
        │                                    └──│  ARCHIVED    │ │
        │                                       └──────────────┘ │
        │                                              │         │
        └──────────────────────────────────────────────┘ (reuse)
```

### Lifecycle Transition Rules

| From | To | Trigger | Effect |
|------|----|---------|--------|
| DRAFT | PENDING_REVIEW | Catalog manager submits | Family visible to reviewers only |
| PENDING_REVIEW | PUBLISHED | Reviewer approves | Family visible to customers |
| PENDING_REVIEW | DRAFT | Reviewer rejects | Returned for edits |
| PUBLISHED | DISCONTINUED | Catalog manager action | No longer in active catalog, existing stock sells through |
| DISCONTINUED | PUBLISHED | Reinstatement | Family returns to active catalog |
| DISCONTINUED | ARCHIVED | Auto (after stock depleted) | Fully removed from catalog. Variants become non-sellable |
| ARCHIVED | DRAFT | Catalog manager action | Family can be rebuilt and republished |

### Variant Lifecycle

```
    ┌────────┐     ┌───────────┐
    │ DRAFT  │────>│ AVAILABLE │
    └────────┘     └───────────┘
                        │
                        ├── (stock > 0 AND stock <= threshold) → LOW_STOCK
                        ├── (stock = 0) → OUT_OF_STOCK
                        │       │
                        │       └── (restocked) → AVAILABLE
                        │
                        └── (discontinued) → DISCONTINUED
```

### Variant Transition Rules

| From | To | Trigger | Effect |
|------|----|---------|--------|
| DRAFT | AVAILABLE | Catalog manager publishes | Becomes sellable (must have active packaging unit) |
| AVAILABLE | LOW_STOCK | Automatic (stock <= threshold) | Still sellable, badge shown |
| LOW_STOCK | AVAILABLE | Automatic (stock > threshold) | Badge removed |
| * | OUT_OF_STOCK | Automatic (stock = 0) | Not sellable, "Notify me" available |
| OUT_OF_STOCK | AVAILABLE | Automatic (restocked) | Becomes sellable again |
| AVAILABLE | DISCONTINUED | Catalog manager | Will not be restocked. Existing stock sells through |
| LOW_STOCK | DISCONTINUED | Catalog manager | Will not be restocked. Existing stock sells through |
| OUT_OF_STOCK | DISCONTINUED | Catalog manager | No stock available, not restocking |
| DISCONTINUED | * | Cannot revert | Permanent terminal state |

### PackagingUnit Lifecycle

```
    ┌────────┐     ┌───────────┐
    │ DRAFT  │────>│   ACTIVE  │
    └────────┘     └───────────┘
                        │
                        v
                  ┌──────────────┐
                  │ DEACTIVATED   │
                  └──────────────┘
```

- A packaging unit cannot be deleted if it has any order history (soft-deactivate only).
- Deactivating a packaging unit makes all its prices inactive.

---

## DELIVERABLE #5: Catalog Navigation Model

### Mental Navigation Paths

A restaurant/café owner navigates the catalog through multiple mental models simultaneously. The catalog must support all of them.

#### Path 1: By Business Need (Most Common)

```
"我需要 supplies for my coffee shop"
  → Coffee Shop Essentials (Collection)
      → Hot Cups (Subcategory)
          → 12oz Hot Cup (ProductFamily)
              → White, 12oz (Variant)
                  → Case of 500 (PackagingUnit → Price → Buy)
      → Compatible Dome Lid → Buy
      → Wooden Stirrer → Buy
      → Cup Sleeves → Buy
```

#### Path 2: By Product Type

```
"我需要 paper cups"
  → Cups (Category)
      → Paper Cups (Subcategory)
          → 8oz, 12oz, 16oz, 20oz, 24oz (Capacity filter)
              → Kraft Paper Cup (ProductFamily)
                  → White, 12oz (Variant → Buy)
```

#### Path 3: By Specification

```
"我需要 12oz cups that are eco-friendly"
  → Search "12oz eco-friendly cup"
      → Results filtered by capacity + eco-friendly attribute
          → Biodegradable Paper Cup (ProductFamily)
              → 12oz, PLA Lined (Variant → Buy)
```

#### Path 4: By Material

```
"我需要 paper products"
  → Search → filter by Material: Paper
      → All paper-based product families across categories
          → Paper Cups, Paper Lids, Paper Bags, Paper Napkins, Paper Straws
```

#### Path 5: By Compatibility (Unique to packaging)

```
"我 need lids for the cups I bought last time"
  → View Order History → Click "Kraft Paper Cup 12oz"
      → Compatible Products section
          → Dome Lid (Fits 12oz) → Buy
          → Flat Lid (Fits 12oz) → Buy
```

#### Path 6: By Brand

```
"我 only use EcoBrand products"
  → Search → filter by Brand: EcoBrand
      → All EcoBrand product families
          → EcoBrand Paper Cup → Buy
          → EcoBrand Lid → Buy
```

#### Path 7: By Stock Status (Urgency-driven)

```
"我需要 it tomorrow — must be in stock"
  → Search → filter by In Stock
      → Results limited to AVAILABLE or LOW_STOCK variants
```

#### Path 8: Complete-the-Order (Mission-driven)

```
"我 need everything for a 200-person event"
  → Collections → Event Pack (200 person)
      → 200 x 12oz Cups
      → 200 x Dome Lids
      → 200 x Napkins
      → 200 x Cutlery Sets
      → 10 x Carry Trays
      → One-click "Add All to Cart"
```

### Navigation Model Summary

| Navigation Mode | Entry Point | Key Dimension |
|----------------|-------------|---------------|
| Business need | Collections | Business segment |
| Product type | Category tree | Product taxonomy |
| Specification | Search + filters | Technical specs |
| Material | Search + Material filter | Material type |
| Compatibility | Product detail → Compatible tab | Compatibility graph |
| Brand | Brand listing | Manufacturer |
| Urgency | Search + Stock filter | Availability |
| Mission | Collections → Event Packs | Complete order bundle |

---

## DELIVERABLE #6: Search Architecture

### Query Understanding

The search engine must understand packaging industry language:

| User Input | Interpreted As |
|------------|---------------|
| "12 oz" | capacity = 12oz |
| "16oz" | capacity = 16oz |
| "paper cup" | subcategory = Paper Cups OR material = Paper |
| "hot cup" | temperature = hot (must handle as feature/tag) |
| "plastic lid" | subcategory = Plastic Lids OR material = Plastic |
| "kraft" | material = Kraft OR brand = Kraft |
| "750 ml" | capacity_ml = 750ml (unit conversion: 750ml ≈ 25oz) |
| "meal box" | subcategory = Meal Boxes OR Containers |
| "soup container" | subcategory = Soup Containers |
| "wooden spoon" | material = Wood AND subcategory = Spoons |

### Synonym Dictionary

```
oz ↔ ounce ↔ oz.
cup ↔ cups
lid ↔ cover ↔ cap ↔ top
kraft ↔ brown paper
biodegradable ↔ eco ↔ compostable ↔ green
straw ↔ drinking straw
container ↔ box ↔ tub ↔ pail
napkin ↔ serviette
cutlery ↔ utensils ↔ silverware
stirrer ↔ stir stick ↔ mixing stick
sleeve ↔ holder ↔ jacket
tray ↔ carrier ↔ caddy
food safe ↔ food grade
microwave ↔ microwaveable
bulk ↔ wholesale ↔ case ↔ volume
```

### Typo Tolerance

| Character Length | Allowed Edits |
|-----------------|---------------|
| 1-3 | 0 (exact match only) |
| 4-6 | 1 edit |
| 7-10 | 2 edits |
| 11+ | 3 edits |

Special: Numbers in capacity queries ("12oz", "16oz") are treated as exact. "12oz" should NOT fuzzy-match "16oz".

### Ranking Strategy

Ranking score = sum of weighted signals:

| Signal | Weight | Source |
|--------|--------|--------|
| Exact name match | 100 | variantName = query |
| Partial name match | 80 | variantName contains query |
| Category match | 60 | Category/subcategory name matches |
| SKU/barcode match | 90 | Exact identifier match |
| Brand match | 50 | Brand name matches |
| Material match | 40 | Material matches |
| Tag match | 30 | Feature/certification matches |
| Popularity | Dynamic (0-50) | Order count / time window |
| Stock boost | +20 if IN_STOCK | Inventory status |
| Promotional boost | +30 if promotional price active | Price type |
| New arrival boost | +10 (decays over 30 days) | CreatedAt |
| Manual sort override | -100 to +100 | Catalog manager setting |

### Filtering-Search Interaction

```
Search Query
    │
    v
Initial Results (ranked)
    │
    ├── Display facet counts for all filterable fields
    │
    v
User applies filters
    │
    v
Filtered Results (re-ranked within filtered set)
    │
    v
Sort applied (if user selected sort: price asc, price desc, new, name)
```

### Search Implementation Notes (Conceptual)

- Use a dedicated search engine (Typesense/Meilisearch/Algolia) — NOT full-text SQL search.
- Index both Arabic and English text fields.
- Numeric fields (capacity, price) must be indexed as ranges for faceted filtering.
- Re-index on catalog change events (product family published, price changed, inventory updated).
- Full re-index nightly.

---

## DELIVERABLE #7: Filtering Strategy

### Industrial-Grade Filters

#### 1. Capacity Filter
```
Type: Range selector with preset buttons
Presets: [<8oz] [8oz] [12oz] [16oz] [24oz] [32oz] [>32oz]
Custom: Min slider — Max slider
Data source: VariantDimensionValue.metadata.capacity_oz (or capacity_ml)
```

#### 2. Material Filter
```
Type: Multi-select checkboxes with count
Options (dynamic, based on current result set):
  □ Paper (42)
  □ Plastic (38)
  □ PLA / Biodegradable (12)
  □ Foam (8)
  □ Aluminum (6)
  □ Wood (4)
  □ Glass (2)
Data source: ProductFamily.material
```

#### 3. Shape Filter
```
Type: Multi-select chips with visual icons
Options:
  Round │ Square │ Rectangle │ Oval │ Custom
Data source: ProductFamily.shape or VariantDimension (shape)
```

#### 4. Diameter Filter
```
Type: Numeric range slider
Unit: mm
Data source: VariantDimensionValue.metadata.diameter_mm
```

#### 5. Height Filter
```
Type: Numeric range slider
Unit: mm
Data source: VariantDimensionValue.metadata.height_mm
```

#### 6. Color Filter
```
Type: Color swatches + text
Options: White, Brown, Black, Clear, Blue, Red, Green, Custom
Data source: VariantDimensionValue (color dimension)
```

#### 7. Brand Filter
```
Type: Multi-select with search within
Data source: Brand.name
```

#### 8. Packaging Unit Filter
```
Type: Single-select
Options: Piece / Sleeve / Box / Case / Carton / Pallet
Data source: PackagingUnit.unitType
```

#### 9. Temperature Resistance Filter
```
Type: Tags
Options: Hot (up to 95°C) │ Cold (-10°C) │ Microwave Safe │ Oven Safe │ Freezer Safe
Data source: ProductFamily boolean fields
```

#### 10. Food Safety Filter
```
Type: Toggle + tags
Options: Food Safe │ Food Grade │ FDA Approved │ BPA Free
Data source: ProductFamily.foodSafe, certifications
```

#### 11. Eco-Friendly Filter
```
Type: Toggle group with sub-options
Options:
  □ Eco Friendly
  □ Biodegradable
  □ Compostable
  □ Recycled Content (>50%)
  □ Recyclable
Data source: ProductFamily eco fields
```

#### 12. Stock Filter
```
Type: Single-select
Options: In Stock Only / Low Stock / Out of Stock
Data source: Derived from Inventory
```

#### 13. Offer/Price Filter
```
Type: Range slider + toggles
Options: On Sale │ Bulk Discount │ Price Range: Min-Max
Data source: Price records
```

#### 14. New Arrival Filter
```
Type: Toggle
Data source: ProductFamily.createdAt (within last 30 days)
```

### Filter UX Rules

1. **Show all filters by default** on category/product listing pages (not hidden behind "Show Filters").
2. **Facet counts** are shown next to each filter option.
3. **Active filters** are displayed as removable chips above the results.
4. **URL state** reflects all active filters.
5. **Mobile**: Filters collapse into a slide-out drawer activated from a prominent button.
6. **Capacities and dimensions** show both imperial (oz, inch) and metric (ml, mm) with auto-conversion.
7. **Reset all** button is always visible when filters are active.
8. **Filters persist** across page navigation within the same category/session.

---

## DELIVERABLE #8: Compatibility Engine

### Core Concept

The Compatibility Engine is a **graph of relationships** between ProductFamilies, with **dimension-aware validation rules** that determine which specific variants are compatible.

### Graph Structure

```
Nodes: ProductFamily
Edges: Compatibility (directed or bidirectional)

Edge Properties:
  - type: fits | contains | pairs_with | required_for | alternative | accessory
  - directionality: directed | bidirectional
  - validationRule (see below)
```

### Validation Rule Types

#### Type 1: Dimension Match (Most Common)

```
Rule: "All variants of Family A with dimension X = value V
       are compatible with all variants of Family B with dimension Y = value V"

Example:
  Family A = Kraft Paper Cup, dimension = capacity (12oz)
  Family B = Dome Lid, dimension = fits_size (Fits 12oz)
  Rule: { ruleType: 'dimension_match', sourceDimension: 'capacity', targetDimension: 'fits_size' }
  
  Result: Variant (Kraft Paper Cup 12oz White) ←→ Variant (Dome Lid Clear Fits_12oz)
```

#### Type 2: Family Match (Simplest)

```
Rule: "All variants of Family A are compatible with all variants of Family B"

Example:
  Family A = Kraft Paper Cup 12oz
  Family B = Wooden Stirrer 6.5"
  
  Result: Any Kraft Paper Cup 12oz variant ←→ Any Wooden Stirrer variant
```

#### Type 3: Value Mapping (Most Flexible)

```
Rule: "Variant of Family A with dimension X = value V1
       is compatible with variant of Family B with dimension Y = value V2"

Example:
  Family A = Soup Container
    Dimension: capacity → { 8oz, 12oz, 16oz, 24oz, 32oz }
  Family B = Soup Lid
    Dimension: fits_size → { Fits 8oz, Fits 12oz, Fits 16oz, Fits 24oz, Fits 32oz }
  
  Rule: { ruleType: 'value_mapping', mappings:
    { '8oz': 'Fits 8oz', '12oz': 'Fits 12oz', '16oz': 'Fits 16oz',
      '24oz': 'Fits 24oz', '32oz': 'Fits 32oz' }
  }
```

#### Type 4: Manual (Override)

```
Rule: "These specific variant IDs are compatible"

Used for exceptional cases that don't follow dimension patterns.
```

### Relationship Ownership

- **Source family owns the relationship** — the ProductFamily that "has" the compatibility.
- Example: Cup Family owns "fits" compatibility to Lid Family. (The cup says "this lid fits me.")
- This means catalog managers create compatibilities from the cup family, not from the lid family.
- But: for discovery purposes, the relationship is navigable from both directions.

### Validation at Order Time

```
function validateOrderCompatibility(orderItems: OrderItem[]): ValidationResult {
  const families = getFamiliesFromItems(orderItems);
  const compatibilities = getCompatibilitiesForFamilies(families);

  for (const [itemA, itemB] of pairs(orderItems)) {
    const familyA = getFamily(itemA.variantId);
    const familyB = getFamily(itemB.variantId);
    const compat = findCompatibility(familyA.id, familyB.id);
    if (!compat) continue; // No compatibility defined — no validation

    const isValid = compat.validate(itemA.variantId, itemB.variantId);
    if (!isValid) {
      return {
        isValid: false,
        warning: `The ${itemA.variantName} may not fit the ${itemB.variantName}`,
        severity: compat.type === 'required_for' ? 'error' : 'warning',
      };
    }
  }

  return { isValid: true };
}
```

### Future Automation

#### Automatic Compatibility Suggestion

When a new ProductFamily is created:

1. Detect its category and subcategory.
2. Find all other families in related categories.
3. Check for shared dimension names (e.g., both have "capacity").
4. Suggest compatibility rules based on dimension matching.
5. Catalog manager approves/rejects suggestions.

Example:

```
New Family: "Compostable Paper Cup 12oz"
  → Category: Cups → Paper Cups
  → Found "Dome Lid" in category Lids → Plastic Lids
  → "Dome Lid" has "fits_size" dimension matching "capacity"
  → Suggested: Compostable Paper Cup 12oz ↔ Dome Lid
  → Status: PENDING_APPROVAL
```

#### Auto-Complete-the-Order

When items are in cart, automatically surface compatible items:

```
Cart contains:
  - Kraft Paper Cup 12oz (Case/500)
  - Wooden Stirrer (Case/5000)

Auto-suggest:
  "Complete your takeaway order:"
  → Dome Lid (Fits 12oz) — Case/500
  → Cup Sleeve (12oz) — Pack/100
  → Carry Tray (4-cup) — Pack/25
```

#### Order History Learning (Future)

After 100+ orders, the system can learn:

- Which products are frequently ordered together.
- Use association rule mining (Apriori/FP-Growth) on order data.
- Auto-suggest frequently-bought-together sets.
- Flag anomalies: "Customers who ordered 12oz cups and 16oz lids had a higher return rate."

---

## DELIVERABLE #9: Architecture Review

### Weaknesses

1. **Complexity of variant dimensions** — The flexible dimension system adds significant complexity. Each new category or supplier relationship requires dimension setup. This is a one-time cost per family but requires training for catalog managers.

2. **Polyhierarchical taxonomy** — Categories mapping to business types via Collections means the same ProductFamily can appear in multiple places. This requires careful collection management to avoid inconsistent cross-references.

3. **Compatibility validation at scale** — Checking all pairwise compatibilities in a large order could be O(n²) in the worst case. For orders with 20+ line items (common in bulk purchasing), this needs optimization.

4. **Pricing complexity** — Tiered pricing per packaging unit per variant creates a large number of price records. A product family with 3 capacities × 2 colors × 3 packaging units × 4 price tiers = 72 price records.

5. **Arabic-English bilingual content** — Every text field (name, description, feature) exists in two languages. This doubles data entry and requires careful i18n handling throughout.

### Trade-offs

| Decision | Trade-off |
|----------|-----------|
| ProductFamily as aggregate root | More complex than flat Product, but enables variant group management and compatibility |
| Dimension system instead of flat attributes | Steeper learning curve for catalog management, but far more flexible for different packaging categories |
| PackagingUnit as separate entity | More joins for price lookups, but supports the reality of bulk/multi-unit sales |
| No SQL in this document | Pure conceptual design, but risks implementation ambiguity |
| Faceted search as primary filter | Requires a search engine (not just DB queries), but essential for industrial-grade filtering |
| Immutable stock movements | More storage, but provides audit trail and prevents inventory errors |

### Future Risks

1. **Catalog manager tooling** — The flexible dimension system requires a powerful admin UI. If the admin UI is under-invested, catalog management becomes painful and error-prone.

2. **Migration from flat Product model** — The existing codebase has a flat `Product` entity. Transitioning to the hierarchical model requires data migration, service layer changes, and UI updates. Risk of data loss if migration is rushed.

3. **Search engine dependency** — The filtering strategy assumes a dedicated search engine. If the project delays search engine integration, filtering will be SQL-based and far slower.

4. **Over-engineering for early stage** — The full compatibility engine may be overkill when the catalog has 50 families. But building it later is harder. Risk is implementing speculatively vs. building on demand.

5. **Order history warm-start** — Frequently-bought-together and popularity signals require order data. Early in the project lifecycle, these signals will be weak or nonexistent, requiring manual seeding.

### Migration Complexity

**From current state to new domain model:**

| Component | Migration Effort | Strategy |
|-----------|-----------------|----------|
| Domain entities | HIGH | Complete rewrite of Product → ProductFamily + Variant + PackagingUnit hierarchy |
| Domain aggregates | MEDIUM | Rebuild aggregate boundaries, existing SaleAggregate needs minimal changes (reference variantId instead of productId) |
| Domain services | HIGH | New services for Compatibility, Pricing tiers, Dimension validation |
| Database | HIGH | Schema migration: flatten → hierarchical. StockMovement already references productId, needs variantId migration |
| Storefront feature | HIGH | All pages reference flat Product type. Need to build new catalog browsing with families + variants |
| Search | HIGH | New search index schema. Old search logic discarded, new search with facet counts needed |
| Cart | MEDIUM | Cart references Product, needs to reference Variant + PackagingUnit + Price |
| Orders | LOW | Orders reference line items with snapshot of price/product. Existing structure is salvageable |
| Auth | NONE | Unchanged |
| Design system | NONE | Unchanged |
| Admin UI | NEW | New tooling for catalog management — doesn't exist yet |

**Total migration complexity: HIGH** — This is essentially a rewrite of the catalog domain, the storefront feature, and the search infrastructure. However, the domain layer was designed with DDD principles and aggregate boundaries, so the restructuring is contained within the catalog context.

### Performance Implications

| Query | Expected Load | Strategy |
|-------|--------------|----------|
| Product family listing (with variants) | High (every page load) | Denormalized catalog view + CDN cache |
| Variant resolution (dimensions → values) | Medium (product detail page) | Eager load all dimensions + values in one query |
| Compatibility lookup | Low-Medium (per family view) | Preload compatibility graph for the current family + immediate neighbors |
| Search | Very High | Dedicated search engine. Never direct DB search |
| Filtered category view | High | Search engine faceted navigation. Not SQL queries |
| Price calculation | Medium (cart/checkout) | Cache price records in Redis. TTL = 5 minutes |
| Inventory check | High (cart, product detail) | Read from inventory cache (Redis). Write-through to DB |
| Order placement | Low-Medium | DB write with serializable isolation for inventory deduction |

### Scaling Implications

| Scale Factor | Bottleneck | Mitigation |
|-------------|------------|------------|
| 100+ ProductFamilies | Category pages loading all family data | Paginate families per category (24/page) |
| 1,000+ variants | Dimension resolution queries | Denormalized variant search index |
| 10,000+ compatibilities | Graph traversal | Precompute adjacency list, cache in Redis |
| 100,000+ price records | Price lookups at checkout | Cache active prices, index by (unitId, type, date) |
| 1M+ inventory records | Real-time availability checks | Read from cached inventory (5s stale accepted for browsing, real-time for cart) |
| 10K+ daily orders | Inventory deduction contention | Queue inventory deduction per order. Batch process with optimistic retry |

---

## Conclusion

This architecture replaces the flat e-commerce Product model with a **hierarchical packaging catalog** designed for:

1. **Multi-dimensional variation** — Capacity, color, material, size as first-class dimensions
2. **Bulk purchasing** — Packaging units as the primary sale entity, not individual items
3. **Compatibility as structure** — Products are not isolated; they exist in a graph of relationships
4. **Industrial filtering** — Technical specs are navigation tools, not product details
5. **Search as infrastructure** — Not a feature, but the primary way customers interact with the catalog

The migration is high complexity but fundamentally necessary. The current flat Product model cannot represent a packaging catalog. Building on the current model would accumulate technical debt that grows exponentially with every new product family.

**Recommendation**: Approve this architecture and proceed with a phased implementation:
- Phase 0: Domain model implementation (entities, aggregates, services)
- Phase 1: Database schema migration
- Phase 2: Catalog admin tooling
- Phase 3: New storefront feature (preserving old during parallel run)
- Phase 4: Search engine integration
- Phase 5: Decommission old code paths
