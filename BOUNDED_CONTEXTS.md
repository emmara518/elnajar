# BOUNDED CONTEXTS & ENTERPRISE ARCHITECTURE

**Project:** TOKYO Packaging Commerce Platform  
**Status:** Domain Architecture — Final Enterprise Review  
**Date:** 2026-07-18

---

## Table of Contents

1. Bounded Contexts
2. Compatibility Engine (Redesigned)
3. Packaging Unit Immutability
4. Search Architecture
5. Pricing Engine
6. Inventory Domain
7. Collections Context
8. Domain Events
9. Architectural Self-Review

---

# DELIVERABLE #1: BOUNDED CONTEXTS

## Context Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  CATALOG      │    │  PRODUCTS     │    │  PRICING     │                  │
│  │  Context      │───>│  Context      │───>│  Context     │                  │
│  │               │    │               │    │              │                  │
│  │ Owns:         │    │ Owns:         │    │ Owns:        │                  │
│  │  Category     │    │  ProductFamily│    │  Price       │                  │
│  │  Subcategory  │    │  Variant      │    │  PriceTier   │                  │
│  │  Brand        │    │  VariantDim   │    │  Campaign    │                  │
│  └───────┬───────┘    │  Compatibilit │    │  Coupon      │                  │
│          │            └───────┬───────┘    └──────┬───────┘                  │
│          │                    │                    │                          │
│          v                    v                    v                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐               │
│  │  INVENTORY   │    │  ORDERS       │    │  SEARCH          │               │
│  │  Context     │<───│  Context      │    │  Context         │               │
│  │              │    │              │    │                  │               │
│  │ Owns:        │    │ Owns:        │    │ Owns:            │               │
│  │  Inventory   │    │  Sale        │    │  SearchIndex     │               │
│  │  StockMovemt │    │  SaleItem    │    │  SearchConfig    │               │
│  │  Reservation │    │  OrderStatus │    │  Synonyms        │               │
│  └───────┬───────┘    └──────┬───────┘    └──────────────────┘               │
│          │                   │                                               │
│          v                   v                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐               │
│  │  CUSTOMERS   │    │  PAYMENTS     │    │  RECOMMENDATIONS  │               │
│  │  Context     │    │  Context      │    │  Context          │               │
│  │              │    │              │    │                   │               │
│  │ Owns:        │    │ Owns:        │    │ Owns:             │               │
│  │  Customer    │    │  Transaction  │    │  RecModel         │               │
│  │  CustomerGrp │    │  Refund       │    │  CrossSellRules   │               │
│  │  Address     │    │  PaymentMethod│    │  FBTData          │               │
│  └───────┬───────┘    └──────┬───────┘    └──────────────────┘               │
│          │                   │                                               │
│          v                   v                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐               │
│  │  SHIPPING    │    │  PROMOTIONS   │    │  NOTIFICATIONS    │               │
│  │  Context     │    │  Context      │    │  Context          │               │
│  │              │    │              │    │                   │               │
│  │ Owns:        │    │ Owns:        │    │ Owns:             │               │
│  │  Shipment    │    │  Campaign    │    │  NotificationTmpl │               │
│  │  Carrier     │    │  Coupon       │    │  NotificationLog   │               │
│  │  Tracking    │    │  PromotionRule│    │  ChannelConfig     │               │
│  └──────────────┘    └──────────────┘    └──────────────────┘               │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐               │
│  │  AUTH         │    │  ANALYTICS    │    │  ADMINISTRATION  │               │
│  │  Context      │    │  Context      │    │  Context          │               │
│  │              │    │              │    │                   │               │
│  │ Owns:        │    │ Owns:        │    │ Owns:             │               │
│  │  User        │    │  Metrics      │    │  AdminWorkflow    │               │
│  │  Role        │    │  Reports      │    │  AuditLog         │               │
│  │  Permission  │    │  Aggregations  │    │  CatalogReview    │               │
│  └──────────────┘    └──────────────┘    └──────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dependency Direction

```
CATALOG ──> PRODUCTS ──> PRICING
                             │
                             v
CATALOG ──> PRODUCTS ──> INVENTORY
                    │        │
                    v        v
                    SEARCH ←─┘
                    │
                    v
CATALOG ──> PRODUCTS ──> ORDERS ──> PAYMENTS ──> SHIPPING
                    │        │
                    v        v
               CUSTOMERS <──┘
                    │
                    v
ORDERS ──> ANALYTICS
PROMOTIONS ──> PRICING
RECOMMENDATIONS ──> ORDERS + PRODUCTS (read-only)
ADMIN ──> PRODUCTS + ORDERS + INVENTORY (write)
AUTH ──> ALL contexts (guard)
```

---

## Context: Catalog

| Field | Description |
|-------|------------|
| **Purpose** | Define and maintain the product taxonomy tree. Categories and subcategories are the backbone of navigation. Brands are manufacturer/supplier identities. |
| **Ownership** | Catalog team (product managers). Category structure changes are infrequent and deliberate. |
| **Responsibilities** | Create/update categories. Assign product families to subcategories. Manage brand registry. Ensure no orphaned categories. |
| **Data Ownership** | `Category`, `Subcategory`, `Brand` — these entities are exclusively owned by this context. No other context can create or modify them directly. |
| **Data References** | None from other contexts. This context is a source of truth. |
| **Public Interfaces** | `ICatalogReader` (query categories, subcategories, brands). `ICatalogWriter` (admin: CRUD operations). |
| **Dependencies** | None. Standalone context. |
| **Forbidden Dependencies** | Must never depend on Orders, Inventory, or Pricing. Categories exist independently of stock or price. |
| **Events Published** | `CategoryCreated`, `CategoryMoved`, `CategoryDeactivated`, `SubcategoryCreated`, `SubcategoryMoved`, `BrandRegistered`, `BrandMerged` |
| **Events Consumed** | None |
| **Future Scalability** | Category trees can grow to thousands of nodes without architectural change. Self-referential parent structure supports arbitrary depth. |

---

## Context: Products

| Field | Description |
|-------|------------|
| **Purpose** | Define the product catalog — product families, variants, variant dimensions, and compatibility relationships. This is the core product data that all other contexts reference. |
| **Ownership** | Catalog team. Product families are created once and rarely fundamentally changed. |
| **Responsibilities** | Create product families with dimensions and variants. Manage compatibility graph between families. Define technical specifications. Manage product lifecycle (draft → published → discontinued). |
| **Data Ownership** | `ProductFamily`, `Variant`, `VariantDimension`, `VariantDimensionValue`, `Compatibility`, `CrossSellStrategy`, `Specification` |
| **Data References** | `Category.id`, `Subcategory.id`, `Brand.id` (from Catalog context — by ID only, no joins) |
| **Public Interfaces** | `IProductReader` (query families, variants, compatibilities). `IProductWriter` (admin: CRUD). `ICompatibilityReader` (graph queries). |
| **Dependencies** | Catalog context (read categories, subcategories, brands) |
| **Forbidden Dependencies** | Must never depend on Inventory, Pricing, or Orders. Products exist without prices or stock. |
| **Events Published** | `ProductFamilyCreated`, `ProductFamilyPublished`, `ProductFamilyDiscontinued`, `ProductFamilyArchived`, `VariantCreated`, `VariantActivated`, `VariantDeactivated`, `VariantDiscontinued`, `VariantDimensionAdded`, `VariantDimensionValueAdded`, `CompatibilityCreated`, `CompatibilityDeactivated`, `ProductFamilyUpdated` |
| **Events Consumed** | None (Catalog events inform but are not required for integrity) |
| **Future Scalability** | Product families and variants scale linearly. The dimension system is flexible enough to handle any packaging category. Graph queries for compatibilities may need a dedicated graph store beyond 10K families. |

---

## Context: Pricing

| Field | Description |
|-------|------------|
| **Purpose** | Manage all pricing logic — list prices, wholesale pricing, tiered pricing, campaign pricing, coupons, and tax calculations. |
| **Ownership** | Pricing team / commercial team. Prices change frequently based on market conditions. |
| **Responsibilities** | Set and maintain prices per packaging unit. Manage price tiers. Apply campaign/promotional prices. Manage coupons/discounts. Calculate final prices. |
| **Data Ownership** | `Price`, `PriceTier`, `CampaignPrice`, `Coupon`, `TaxRate`, `DiscountRule` |
| **Data References** | `PackagingUnit.id` (from Products context — by ID only) |
| **Public Interfaces** | `IPricingCalculator` (calculate final price for a given packaging unit, quantity, customer group, coupons). `IPricingAdmin` (CRUD for prices, tiers, campaigns). |
| **Dependencies** | Products context (read packaging units). Promotions context (read active campaigns and coupons). Customers context (read customer group for group pricing). |
| **Forbidden Dependencies** | Must never depend on Inventory or Orders directly. Pricing does not change based on stock levels. |
| **Events Published** | `BasePriceSet`, `PriceTierUpdated`, `CampaignPriceActivated`, `CampaignPriceExpired`, `PriceRecalculationNeeded` |
| **Events Consumed** | `PromotionActivated`, `PromotionExpired` (from Promotions context — to apply/remove campaign prices). `CustomerGroupChanged` (from Customers — to recalculate group pricing). |
| **Future Scalability** | Price records grow with packaging units and price tiers. Historical price records are immutable. At 1M+ active prices, caching and read replicas become critical. |

---

## Context: Inventory

| Field | Description |
|-------|------------|
| **Purpose** | Track stock levels, manage reservations, and ensure inventory integrity across all warehouses. |
| **Ownership** | Warehouse / logistics team. Inventory is updated in real-time through warehouse operations. |
| **Responsibilities** | Maintain stock counts per packaging unit per location. Process stock movements. Manage reservations for pending orders. Generate low-stock alerts. |
| **Data Ownership** | `Inventory`, `StockMovement`, `Reservation`, `Warehouse` |
| **Data References** | `PackagingUnit.id` (from Products — by ID). `Variant.id` (from Products — by ID). |
| **Public Interfaces** | `IInventoryService` (check stock, reserve stock, release stock, adjust stock, get low-stock alerts). `IStockMovementReader` (query movement history). |
| **Dependencies** | Products context (read packaging units and variants for stock tracking). Orders context (receive reservation requests and release signals). |
| **Forbidden Dependencies** | Must never depend on Pricing or Customers. Stock levels are independent of who buys or at what price. |
| **Events Published** | `InventoryAdjusted`, `InventoryReserved`, `InventoryReleased`, `InventoryCommitted`, `LowStockAlert`, `OutOfStockAlert`, `StockMovementRecorded`, `InventoryCountStarted`, `InventoryCountCompleted` |
| **Events Consumed** | `OrderPlaced` (reserve inventory), `OrderCancelled` (release reserved inventory), `OrderShipped` (commit and deduct inventory), `OrderReturned` (add back to inventory) |
| **Future Scalability** | Multi-warehouse support requires Inventory per (packagingUnit, warehouse) pair. At 10+ warehouses and 100K+ packaging units, this is 1M+ inventory records. Partition by warehouse region. |

---

## Context: Orders

| Field | Description |
|-------|------------|
| **Purpose** | Manage the complete order lifecycle — creation, fulfillment, cancellation, returns. |
| **Ownership** | Sales / customer service team. Orders are the core business transaction. |
| **Responsibilities** | Create orders from cart. Manage order status transitions. Coordinate with Inventory (reserve), Payments (collect), Shipping (deliver). Handle cancellations and returns. |
| **Data Ownership** | `Sale` (aggregate root — owns SaleItems and Payments), `OrderStatus` (state machine), `ReturnRequest`, `OrderNote` |
| **Data References** | `Variant.id`, `PackagingUnit.id` (from Products — snapshot at order time, never re-resolved). `Customer.id` (from Customers). `Price.amount` (snapshot from Pricing at order time). `Inventory.reservation` (coordination). |
| **Public Interfaces** | `IOrderService` (place order, cancel order, return items). `IOrderReader` (query orders by customer, date range, status). |
| **Dependencies** | Products (read variant names/specs at order time — snapshotted). Pricing (read price at order time — snapshotted). Inventory (must coordinate reservations). Customers (associate order with customer). Payments (process payment). Shipping (create shipment). |
| **Forbidden Dependencies** | Must never have real-time dependency on Pricing or Products after order placement. Order line items capture all variant/price data at time of order. |
| **Events Published** | `OrderPlaced`, `OrderConfirmed`, `OrderShipped`, `OrderDelivered`, `OrderCancelled`, `OrderReturnRequested`, `OrderReturnApproved`, `OrderRefunded`, `OrderLineItemAdded`, `OrderLineItemRemoved` |
| **Events Consumed** | `PaymentCompleted` (transition to confirmed), `PaymentFailed` (notify customer), `ShipmentCreated` (transition to shipped), `ShipmentDelivered` (transition to delivered) |
| **Future Scalability** | Orders are append-only. Historical orders never change (only status transitions). Partition by date range for archival. At 10K+ orders/day, consider event-sourced order storage. |

---

## Context: Customers

| Field | Description |
|-------|------------|
| **Purpose** | Manage business customer identities, profiles, groups, and address books. |
| **Ownership** | Customer service / sales team. |
| **Responsibilities** | Register customers. Manage customer groups (restaurant, café, bakery, wholesaler). Manage address books. Track customer preferences and order history references. |
| **Data Ownership** | `Customer`, `CustomerGroup`, `Address`, `CustomerPreference`, `BusinessProfile` (business type, license, tax ID) |
| **Data References** | `User.id` (from Auth — links platform account to customer profile) |
| **Public Interfaces** | `ICustomerService` (get customer, update profile, manage addresses). `ICustomerGroupService` (query groups and group pricing eligibility). |
| **Dependencies** | Auth context (read user identity). |
| **Forbidden Dependencies** | Must never depend on Inventory or Pricing directly. Customer data is profile information, not transactional. |
| **Events Published** | `CustomerCreated`, `CustomerUpdated`, `CustomerGroupChanged`, `CustomerAddressAdded`, `CustomerAddressRemoved`, `CustomerDeactivated` |
| **Events Consumed** | `UserLoggedIn` (track last login), `OrderPlaced` (update last order date) |
| **Future Scalability** | Customer records scale linearly with the business. Profiles include business verification documents which require secure storage. |

---

## Context: Payments

| Field | Description |
|-------|------------|
| **Purpose** | Process financial transactions, manage refunds, and maintain payment reconciliation. |
| **Ownership** | Finance team. |
| **Responsibilities** | Process payments via configured gateways. Handle refunds and chargebacks. Maintain transaction ledger. Reconcile payments with orders. |
| **Data Ownership** | `Transaction`, `Refund`, `PaymentMethod`, `PaymentGatewayConfig`, `SettlementRecord` |
| **Data References** | `Sale.id` (from Orders — associates payment with order). `Customer.id` (from Customers — for saved payment methods). |
| **Public Interfaces** | `IPaymentService` (charge, refund, void, capture). `IPaymentMethodService` (save, retrieve, delete payment methods). |
| **Dependencies** | Orders (associate payments with orders). Customers (for saved payment methods, though payment details are never stored raw — only tokenized references). |
| **Forbidden Dependencies** | Must never depend on Inventory or Products. Payment processing is independent of what was bought. |
| **Events Published** | `PaymentInitiated`, `PaymentCompleted`, `PaymentFailed`, `PaymentRefunded`, `PaymentChargeback`, `PaymentMethodAdded`, `PaymentMethodRemoved` |
| **Events Consumed** | `OrderPlaced` (initiate payment). `OrderReturnApproved` (initiate refund). |
| **Future Scalability** | Payment processing is handled by external gateways. The context stores transaction references and reconciliation data. At 10K+ transactions/day, reconciliation becomes a significant batch process. |

---

## Context: Shipping

| Field | Description |
|-------|------------|
| **Purpose** | Manage logistics — shipments, carriers, tracking, delivery scheduling. |
| **Ownership** | Logistics team. |
| **Responsibilities** | Create shipments from orders. Assign carriers. Generate labels. Track deliveries. Handle delivery failures and returns logistics. |
| **Data Ownership** | `Shipment`, `Carrier`, `TrackingRecord`, `DeliverySlot`, `ShippingRate`, `ShippingRule`, `ReturnLabel` |
| **Data References** | `Sale.id` (from Orders). `CustomerAddress.id` (from Customers). `PackagingUnit.id` (for weight/dimensions). |
| **Public Interfaces** | `IShippingService` (create shipment, get tracking, calculate rates). `ICarrierIntegration` (abstract carrier API interface). |
| **Dependencies** | Orders (create shipments for orders). Customers (read shipping addresses). Products (read packaging unit weights/dimensions). |
| **Forbidden Dependencies** | Must never depend on Pricing or Inventory. Shipping is about logistics, not commerce. |
| **Events Published** | `ShipmentCreated`, `ShipmentPickedUp`, `ShipmentInTransit`, `ShipmentDelivered`, `ShipmentDelayed`, `ShipmentFailed`, `ShipmentReturned` |
| **Events Consumed** | `OrderPlaced` (initiate shipment creation after payment). `OrderShipped` (published by this context after carrier pickup). |
| **Future Scalability** | Multiple carriers with different APIs require a clean abstract interface. Regional carrier integrations are added as new implementations. At volume, route optimization and warehouse zone picking become relevant sub-domains. |

---

## Context: Search

| Field | Description |
|-------|------------|
| **Purpose** | Provide fast, accurate product search and discovery across the catalog. |
| **Ownership** | Platform engineering team. |
| **Responsibilities** | Maintain search index. Handle search queries with faceted filtering. Provide autocomplete suggestions. Manage synonyms and ranking. Ensure Arabic/English/bilingual search quality. |
| **Data Ownership** | `SearchIndex` (materialized view — owns the index, not the source data), `SearchConfiguration` (synonyms, stop words, ranking weights), `SearchAnalytics` (query logs) |
| **Data References** | All context data is read-only references. The search index is built from events, not direct queries. |
| **Public Interfaces** | `ISearchService` (search, suggest, facet search). `ISearchAdmin` (reindex, update configuration, manage synonyms). |
| **Dependencies** | Depends on events from Products, Pricing, Inventory, and Catalog contexts. No direct database access to other contexts. |
| **Forbidden Dependencies** | Must never have direct database access to any other context. All data must arrive via events and be stored in the search index. |
| **Events Published** | `SearchIndexUpdated`, `SynonymSetCreated`, `RankingWeightUpdated` |
| **Events Consumed** | `ProductFamilyPublished`, `VariantCreated`, `VariantDeactivated`, `PriceChanged`, `InventoryAdjusted`, `PromotionActivated` (all trigger index updates) |
| **Future Scalability** | Search is the most queried service in the platform. Must be horizontally scalable. Search vendor abstraction allows swapping providers without application changes. |

---

## Context: Recommendations

| Field | Description |
|-------|------------|
| **Purpose** | Generate product recommendations — frequently bought together, cross-sell, upsell, alternative products. |
| **Ownership** | Data science / marketing team (future: ML-driven). |
| **Responsibilities** | Compute frequently-bought-together relationships. Generate personalized recommendations. Manage cross-sell rules. Feed recommendation signals to the Products context. |
| **Data Ownership** | `RecommendationModel`, `ComputedRelationship`, `RecommendationLog` |
| **Data References** | Reads from Orders (order history), Products (product family/variant data), Customers (for personalization). All read-only via events or read replicas. |
| **Public Interfaces** | `IRecommendationService` (get recommendations for product, get recommendations for customer) |
| **Dependencies** | Orders context (read order history). Products context (read product data). Customers context (for personalization). |
| **Forbidden Dependencies** | Must never write to Products, Orders, or any other context. Recommendations are computed data, not source of truth. |
| **Events Published** | `RecommendationsUpdated`, `FBTComputed`, `CrossSellSuggested` |
| **Events Consumed** | `OrderPlaced` (feed data to recommendation model). `ProductFamilyPublished` (include new family in recommendations). |
| **Future Scalability** | Early stage: rule-based recommendations. Mid stage: collaborative filtering. Later: ML model serving. Architecture must support all three without changing the API. |

---

## Context: Promotions

| Field | Description |
|-------|------------|
| **Purpose** | Manage marketing campaigns, promotional pricing, and discount codes. |
| **Ownership** | Marketing team. |
| **Responsibilities** | Create and manage promotional campaigns. Generate discount codes. Set promotional pricing rules. Schedule promotion start/end dates. |
| **Data Ownership** | `Campaign`, `PromotionRule`, `DiscountCode`, `PromotionBudget`, `RedemptionLog` |
| **Data References** | `ProductFamily.id` (which products are on promotion). `CustomerGroup.id` (targeted customer segments). |
| **Public Interfaces** | `IPromotionService` (validate discount code, get active promotions, calculate discount). `IPromotionAdmin` (manage campaigns). |
| **Dependencies** | Products context (read product families for promotion assignment). Customers context (read customer groups for targeting). |
| **Forbidden Dependencies** | Must never depend on Inventory or Search. Promotions are marketing data, not operational. |
| **Events Published** | `PromotionActivated`, `PromotionExpired`, `PromotionBudgetExhausted`, `DiscountCodeCreated`, `DiscountCodeRedeemed` |
| **Events Consumed** | None (this context is a source of truth that others consume) |
| **Future Scalability** | Promotions are temporal — they have start/end dates. Historical promotion data must be preserved for order reconciliation. At scale, promotion budget tracking and real-time redemption limits require careful design. |

---

## Context: Administration

| Field | Description |
|-------|------------|
| **Purpose** | Admin UI workflows, catalog approval processes, and audit logging. |
| **Ownership** | Operations team. |
| **Responsibilities** | Manage catalog approval workflows. Log all admin actions. Provide audit trails. Manage admin user roles within the platform. |
| **Data Ownership** | `AdminWorkflow`, `ApprovalRequest`, `AuditLog`, `AdminAction` |
| **Data References** | All contexts read and write via their public interfaces. This context orchestrates workflows across contexts. |
| **Public Interfaces** | `IWorkflowService` (submit for approval, approve, reject, review). `IAuditService` (query audit log, export audit trail). |
| **Dependencies** | All contexts (workflows touch every domain). |
| **Forbidden Dependencies** | None — but this context must never own business data. It only orchestrates and logs. |
| **Events Published** | `ProductApprovalRequested`, `ProductApproved`, `ProductRejected`, `PriceChangeApproved`, `CatalogChangeLogged` |
| **Events Consumed** | All significant domain events (for audit logging). |
| **Future Scalability** | Audit logs are append-only and grow unboundedly. Partition by date, archive older than 7 years. |

---

## Context: Authentication

| Field | Description |
|-------|------------|
| **Purpose** | Identity and access management — users, roles, permissions, sessions. |
| **Ownership** | Platform engineering / security team. |
| **Responsibilities** | Authenticate users. Authorize actions based on roles and permissions. Manage sessions. Handle password policies and MFA. |
| **Data Ownership** | `User`, `Role`, `Permission`, `Session`, `AuthProvider`, `MFAConfig` |
| **Data References** | None (this context is purely about identity, not business data) |
| **Public Interfaces** | `IAuthService` (login, logout, verify, refresh). `IAuthorizationService` (check permission, check role). `IUserManagement` (CRUD users). |
| **Dependencies** | None (standalone context backed by an identity provider like Supabase Auth) |
| **Forbidden Dependencies** | Must never have any business domain dependency. Authentication is a cross-cutting concern. |
| **Events Published** | `UserRegistered`, `UserLoggedIn`, `UserLoggedOut`, `UserRoleChanged`, `UserPermissionChanged`, `UserSuspended`, `UserActivated`, `MFARegistered`, `MFAUnregistered` |
| **Events Consumed** | None |
| **Future Scalability** | Auth is typically handled by an external provider (Supabase Auth, Auth0). The context wraps the provider. SSO/SAML support for enterprise customers may require additional provider configuration. |

---

## Context: Notifications

| Field | Description |
|-------|------------|
| **Purpose** | Send notifications across multiple channels (email, SMS, in-app, push). |
| **Ownership** | Platform engineering team. |
| **Responsibilities** | Manage notification templates. Send notifications on domain events. Track delivery status. Handle channel preferences. |
| **Data Ownership** | `NotificationTemplate`, `NotificationLog`, `ChannelConfig`, `NotificationPreference` |
| **Data References** | `User.id` (who to notify). `Order.id` (context for order-related notifications). `Customer.id` (for preference lookup). |
| **Public Interfaces** | `INotificationService` (send, get status, manage preferences). `INotificationTemplateService` (manage templates). |
| **Dependencies** | Depends on domain events from all contexts. Template rendering may reference order/pricing/product data but only for display purposes. |
| **Forbidden Dependencies** | Must never be a critical path for any business transaction. Notification failures must never block order placement. |
| **Events Published** | `NotificationSent`, `NotificationFailed`, `NotificationClicked` |
| **Events Consumed** | `OrderPlaced`, `OrderShipped`, `OrderDelivered`, `PaymentFailed`, `LowStockAlert`, `PromotionActivated`, `WelcomeNewCustomer` (all trigger appropriate notifications) |
| **Future Scalability** | At volume, use a dedicated notification queue. Template management can become a self-service tool for marketing. |

---

## Context: Analytics

| Field | Description |
|-------|------------|
| **Purpose** | Business intelligence, reporting, and aggregated metrics. |
| **Ownership** | Data / BI team. |
| **Responsibilities** | Aggregate and store business metrics. Generate reports. Provide dashboards. Maintain data warehouse. |
| **Data Ownership** | `AggregatedMetrics`, `Report`, `Dashboard`, `DataWarehouse` (read-only replicas of context data) |
| **Data References** | All context data — but only via read replicas or event streams. Never queries production databases. |
| **Public Interfaces** | `IAnalyticsService` (query metrics, get reports). `IAnalyticsAdmin` (schedule reports, manage dashboards). |
| **Dependencies** | All contexts — but only via read replicas. No transactional dependencies. |
| **Forbidden Dependencies** | Must never have a transactional dependency on any context. Analytics must never block or slow down business operations. |
| **Events Published** | `ReportGenerated`, `AnomalyDetected` |
| **Events Consumed** | All domain events (for aggregation and reporting). |
| **Future Scalability** | This context is best served by a dedicated data warehouse and ETL pipeline. Real-time dashboards use materialized views updated by events. Historical data retention (7+ years) requires partitioning. |

---

# DELIVERABLE #2: COMPATIBILITY ENGINE (REDESIGNED)

## Graph-Based Compatibility Model

Compatibility is a **directed, typed graph** where nodes are ProductFamilies and edges are typed relationships with validation rules.

### Edge Types

```
Edge Type              Semantics                Directionality      Order Impact
────────────────────────────────────────────────────────────────────────────────
COMPATIBLE_WITH        Products work together    Bidirectional       Suggestion
                       without issues
REQUIRES               Product A requires        Directed (A → B)    Validation BLOCK
                       Product B to function
OPTIONAL_ACCESSORY     Product B enhances        Directed (A → B)    Suggestion
                       Product A's use
UPSELL                 Higher-value alternative  Directed (A → B)    Suggestion
                       to Product A
CROSS_SELL             Related product in        Bidirectional       Suggestion
                       different category
ALTERNATIVE            Equivalent substitution   Bidirectional       Allow in cart
                       for Product A                                  (mutually exclusive)
REPLACEMENT            Direct replacement        Directed            Allow in cart
                       (old → new)               (discontinued →     (mutually exclusive)
                                                  current)
MANDATORY_PAIR         Cannot be sold            Bidirectional       Validation BLOCK
                       separately                                      if only one present
```

### Graph Structure

```
Nodes: ProductFamily
Edges: Compatibility (typed, directed or bidirectional)

Example subgraph:
                           COMPATIBLE_WITH
  Kraft Paper Cup 12oz ──────────────────────> Dome Lid (Fits 12oz)
         │                                           │
         │ MANDATORY_PAIR (for takeaway)              │ COMPATIBLE_WITH
         v                                           v
  [Takeaway Order]                              Flat Lid (Fits 12oz)
         │
         ├── REQUIRES ──> Dome Lid (Fits 12oz)    [if takeaway = true]
         <── OPTIONAL_ACCESSORY ── Wooden Stirrer
         <── OPTIONAL_ACCESSORY ── Cup Sleeve 12oz
         <── CROSS_SELL ── Dispenser Napkins
         <── UPSELL ── Premium Kraft Cup 12oz (better material)
         <── ALTERNATIVE ── Biodegradable Cup 12oz
```

### Ownership

- **Edges are owned by the source node** (the ProductFamily that "has" the relationship).
- Exception: `REQUIRES` and `MANDATORY_PAIR` must be owned by the domain (administrative), not by individual product managers.
- `REPLACEMENT` edges are owned by the deprecated family (to ensure the old SKU points to the correct replacement).

### Validation Rules (Per Edge)

Every edge carries a `ValidationRule`:

```
ValidationRule = {
  type: 'always' | 'dimension_match' | 'value_map' | 'conditional'
  rule?: {
    sourceDimension?: string     // e.g., "capacity"
    targetDimension?: string     // e.g., "fits_size"
    valueMapping?: { [k: string]: string }  // e.g., {"12oz": "Fits 12oz"}
    condition?: {
      attribute: string          // e.g., "orderType"
      operator: 'eq' | 'neq'
      value: string              // e.g., "takeaway"
    }
  }
  conflictResolution: 'override' | 'block' | 'warn_only'
  version: number                // incremented on any change
}
```

### Validation Examples

| Edge | Source Family | Target Family | Rule |
|------|--------------|--------------|------|
| COMPATIBLE_WITH | Kraft Paper Cup 12oz | Dome Lid Fits 12oz | `dimension_match: source.capacity = target.fits_size.values` |
| REQUIRES | Any Hot Cup | Any Lid (when takeaway) | `conditional: orderType = 'takeaway' → require lid in cart` |
| ALTERNATIVE | Kraft Paper Cup 12oz | Biodegradable Cup 12oz | `always` (by definition) |
| REPLACEMENT | Kraft Paper Cup 12oz (old SKU) | Kraft Paper Cup 12oz v2 | `always` |

### Versioning

- Every edge has a `version` field, incremented on any change.
- Historical compatibility data is preserved for order reconciliation. An order placed with v1 compatibility rules should be validated against v1 rules if re-examined.
- Conflict: if two edges disagree about a specific variant pair, the more restrictive edge wins (`MANDATORY_PAIR` > `REQUIRES` > `COMPATIBLE_WITH` > `OPTIONAL_ACCESSORY` > `ALTERNATIVE`).

### Conflict Resolution

```
Conflict: When two edges connect the same pair of families with different types.

Resolution Priority (highest wins):
  1. MANDATORY_PAIR
  2. REQUIRES
  3. REPLACEMENT
  4. ALTERNATIVE
  5. COMPATIBLE_WITH
  6. UPSELL
  7. CROSS_SELL
  8. OPTIONAL_ACCESSORY

If same priority: the edge with the more specific validation rule wins.
If still tied: the most recently created edge wins (with warning logged).
```

### Future Recommendation Engine Integration

The compatibility graph is the **foundation** for automated recommendations:

1. **Seed phase** (Year 1): All edges manually created by catalog managers.
2. **Suggestion phase** (Year 2): System suggests edges based on:
   - Shared dimension names and values between families in related categories.
   - Frequently co-ordered product pairs (from order history).
   - Category adjacency (families in subcategories of the same category).
3. **Automated phase** (Year 3+): ML model generates `FREQUENTLY_BOUGHT_TOGETHER` edges with confidence scores:
   - Edges with confidence > 90% become `COMPATIBLE_WITH` automatically.
   - Edges with 70-90% are suggested for admin approval.
   - Edges < 70% are logged for data science review.
4. **Self-learning** (Year 4+): The graph adapts based on acceptance/rejection rates.

---

# DELIVERABLE #3: PACKAGING UNIT IMMUTABILITY

## Why PackagingUnits Must Be Immutable

A PackagingUnit represents a **specific, physical way a product is packaged for sale**. Changing any of its properties means the physical item on the shelf is different.

### What Immutability Means

```
CREATE: A new PackagingUnit is created with fixed properties.
READ:   Any part of the system can read the unit.
UPDATE: PROHIBITED. If a change is needed, a NEW unit is created.
DELETE: SOFT DELETE only (deactivate). The record must persist forever.
```

### What Triggers a New Unit

| Change | Old Unit | New Unit |
|--------|----------|----------|
| Case quantity changes from 500 to 600 | Deactivated | New unit with case quantity 600 |
| Weight changes (different box material) | Deactivated | New unit with new weight |
| Barcode changes (supplier reissued) | Deactivated | New unit with new barcode |
| Packaging type (case → carton) | Deactivated | New unit with carton type |
| Product reformulated (different dimensions) | Deactivated | New unit with new dimensions |

### What Does NOT Trigger a New Unit

| Change | Action |
|--------|--------|
| Price change | New Price record (unit unchanged) |
| Inventory adjustment | Inventory update (unit unchanged) |
| Promotion applied | New CampaignPrice (unit unchanged) |
| Description update | ProductFamily description change (unit unchanged) |

### Benefits

1. **Historical Order Integrity** — An order referencing PackagingUnit ID "PU-123" always means "Case of 500, weight 4.5kg, barcode 0623001234567." The immutable record is the source of truth.
2. **Inventory Accuracy** — Stock is tracked per unit ID. If the unit changes, there's no ambiguity about which physical stock is being counted.
3. **Pricing History** — Each unit version has its own price history. A price change on a unit is clear and auditable.
4. **Barcode Stability** — Warehouses scan barcodes. If a barcode changes, the old barcode must still resolve (to a deactivated unit) for reconciliation.
5. **Supplier Clarity** — Suppliers send updated spec sheets. Immutable units prevent accidental overwrite of active stock data.

### Historical Orders

When a PackagingUnit is deactivated and replaced:

```
Order #1234 (placed 2026-01-15):
  Line Item:
    Product: Kraft Paper Cup 12oz, White
    Unit: PU-123 (Case of 500, SAR 45.00)
    This record never changes.

After unit change (2026-06-01):
  PU-123 → deactivated
  PU-456 → created (Case of 600, SAR 52.00)

Order #5678 (placed 2026-07-01):
  Line Item:
    Product: Kraft Paper Cup 12oz, White
    Unit: PU-456 (Case of 600, SAR 52.00)
    Correctly references the new unit.
```

### Inventory Impact

When deactivating PU-123 and creating PU-456:

```
Inventory[PU-123][Warehouse-A] = 50 cases remaining
  → These 50 cases are still sellable (PU-123 is deactivated but stock exists).
  → They sell through via existing orders or a clearance price.
  → Once stock hits 0, PU-123 is fully archived.

Inventory[PU-456][Warehouse-A] = 0 (new unit, awaiting first stock receipt)
  → Once supplier delivers the new cases, inventory is added.
```

### Migration from Old to New

```
Transition period: BOTH units active simultaneously.

Day 1: PU-123 (old, qty=500, remaining stock=50) + PU-456 (new, qty=600, initial stock=0)
Day 7: PU-123 (remaining stock=25) + PU-456 (received stock=100)
Day 14: PU-123 (remaining stock=0, auto-deactivated) + PU-456 (stock=95)

The system shows the default unit as PU-456 (the current one).
PU-123 is visible only if the customer specifically filters for it or is reordering.
```

---

# DELIVERABLE #4: SEARCH ARCHITECTURE

## Abstraction Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Application Layer (storefront, API, admin)                     │
│         │                                                       │
│         v                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ISearchService Interface                    │   │
│  │                                                         │   │
│  │  + search(query, filters, sort, page): SearchResults    │   │
│  │  + suggest(query): Suggestion[]                         │   │
│  │  + facetSearch(query, fields): FacetCounts              │   │
│  │  + index(document): void                                │   │
│  │  + bulkIndex(documents): void                           │   │
│  │  + deleteIndex(id): void                                │   │
│  │  + clearIndex(): void                                   │   │
│  │  + reindex(strategy): ReindexResult                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         v                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SearchProvider (abstract)                   │   │
│  │                                                         │   │
│  │  + configure(settings): void                            │   │
│  │  + health(): HealthStatus                               │   │
│  │  + stats(): IndexStats                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ├──────────────────┬──────────────────┬────────────────┤
│         v                  v                  v                v
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │  Typesense    │  │  Meilisearch  │  │  OpenSearch   │  │  Algolia     │
│  │  Provider     │  │  Provider     │  │  Provider     │  │  Provider    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SearchDocument Schema                       │   │
│  │  (defined once, provider maps to its native format)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## ISearchService Interface (Conceptual)

```
interface ISearchService {
  search(params: SearchParams): SearchResults
  suggest(query: string, limit?: number): Suggestion[]
  getFacets(params: FacetParams): FacetCounts[]
  indexDocument(doc: SearchDocument): void
  bulkIndex(docs: SearchDocument[]): void
  deleteDocument(id: string): void
  clearIndex(): void
  reindex(strategy?: ReindexStrategy): Promise<ReindexResult>
  getHealth(): HealthStatus
  getStats(): IndexStats
}

interface SearchParams {
  query: string
  filters?: SearchFilter[]
  sort?: SearchSort
  page: number
  pageSize: number
  locale?: 'ar' | 'en' | 'all'
}

interface SearchResults {
  items: SearchResult[]
  total: number
  page: number
  pageSize: number
  facets?: FacetCounts[]
  didYouMean?: string
}
```

## Provider Comparison

| Feature | Typesense | Meilisearch | OpenSearch | Algolia |
|---------|-----------|-------------|------------|---------|
| Self-hosted | Yes | Yes | Yes | No |
| Cloud managed | No | Yes | Yes (AWS) | Yes |
| Arabic support | Good | Good | Good | Good |
| Typo tolerance | Built-in | Built-in | Custom | Built-in |
| Faceted search | Native | Native | Native | Native |
| Geo search | Yes | Yes | Yes | Yes |
| Cost | Free | Free tier | Free | Paid |
| Performance | Fastest | Fast | Moderate | Fast |
| ML ranking | No | No | No | Yes (AI) |
| Schema flexibility | Strict | Flexible | Very flexible | Fixed |

## Indexing Pipeline

```
Domain Events ──> Event Bus
                     │
                     v
              ┌──────────────┐
              │  Indexer      │
              │  Service      │
              │               │
              │  - Batches     │
              │    events      │
              │  - Transforms  │
              │    to docs     │
              │  - Publishes   │
              │    to queue    │
              └──────┬───────┘
                     │
                     v
              ┌──────────────┐
              │  Index Queue   │
              │  (buffer)      │
              └──────┬───────┘
                     │
                     v
              ┌──────────────┐
              │  Bulk Indexer  │
              │               │
              │  - Batches 100 │
              │    docs        │
              │  - Retries on  │
              │    failure     │
              └──────┬───────┘
                     │
                     v
              ┌──────────────┐
              │  Search        │
              │  Provider      │
              └──────────────┘
```

## Reindex Strategy

### Full Reindex
- Triggered: Manually or after schema change.
- Process: Clear index → drain all events from source → rebuild from scratch.
- Impact: Search unavailable during reindex (typically < 30 min).
- Mitigation: Run on a secondary index, swap when complete.

### Partial Reindex
- Triggered: Price updates, inventory changes, promotion de/activation.
- Process: Index only the affected documents.
- Impact: None (incremental).

### Scheduled Reindex
- Full reindex nightly (low traffic period).
- Synchronizes data that may have been missed by events.

## Ranking Strategy

```
Score = sum of weighted signals:

  exact_title_match      × 100   // "Kraft Paper Cup 12oz" matches query exactly
  prefix_match           × 80    // "Kraft Paper" matches "Kraft Paper Cup"
  partial_title_match    × 60    // "Cup" matches title
  category_match         × 50    // query matches category name
  sku_match              × 90    // exact SKU
  barcode_match          × 90    // exact barcode
  brand_match            × 40    // brand name matches
  material_match         × 30    // material attribute matches
  tag_match              × 20    // feature/certification matches
  popular_boost          × 0-50  // derived from order count
  stock_boost            × 20    // in stock > low stock > out of stock
  promo_boost            × 30    // currently on promotion
  new_boost              × 10    // created < 30 days (decays daily)
  manual_boost           × -100 to +100  // catalog manager override
```

## Synonym Strategy

### Global Synonyms (apply to all searches)

```
oz ↔ ounce ↔ oz.
cup ↔ cups
biodegradable ↔ eco ↔ compostable ↔ green ↔ environment friendly
food service ↔ takeaway ↔ to-go
bulk ↔ wholesale ↔ case ↔ volume ↔ commercial
food safe ↔ food grade ↔ FDA
```

### Category-Specific Synonyms (apply only within category context)

```
Within Cups:
  "hot" ↔ "hot drink" ↔ "coffee" ↔ "tea"
  "cold" ↔ "cold drink" ↔ "soda" ↔ "iced"
  "paper" ↔ "kraft" ↔ "cardboard"

Within Lids:
  "dome" ↔ "domed" ↔ "sipper lid"
  "flat" ↔ "tight" ↔ "snap on"

Within Cutlery:
  "spoon" ↔ "soup spoon"
  "fork" ↔ "dinner fork"
  "knife" ↔ "butter knife"
  "stirrer" ↔ "stir stick" ↔ "mixing stick" ↔ "coffee stirrer"
```

### Numerical Mapping

```
"12oz" → { capacity_oz: 12 }
"12 oz" → { capacity_oz: 12 }
"12 ounce" → { capacity_oz: 12 }
"355ml" → { capacity_ml: 355 }  (and optionally: { capacity_oz: 12 })
"750 ml" → { capacity_ml: 750 }  (and optionally: { capacity_oz: 25.4 })
```

## Typo Tolerance

| Query Length | Allowed Edits | Notes |
|-------------|---------------|-------|
| 1-2 | 0 | Too short to correct |
| 3-4 | 1 | Single character |
| 5-8 | 2 | |
| 9+ | 3 | |

**Exception**: Numeric values in queries ("12oz", "500ml") have 0 typo tolerance. "12oz" must not fuzzy-match "16oz". Numbers are treated as exact specifications.

## Unit Parsing

The search layer must parse and normalize units from queries:

```
Input: "12oz paper cup"
Parsed: { query: "paper cup", filters: [{ field: "capacity_oz", op: "eq", value: 12 }] }

Input: "8oz to 16oz cups"
Parsed: { query: "cups", filters: [{ field: "capacity_oz", op: "gte", value: 8 }, { field: "capacity_oz", op: "lte", value: 16 }] }

Input: "500ml container"
Parsed: { query: "container", filters: [{ field: "capacity_ml", op: "eq", value: 500 }] }
```

## Arabic, English, and Mixed Search

### Arabic Search
- Index Arabic text fields (name_ar, description_ar, features_ar).
- Arabic stemmer for root-based matching.
- Arabic synonyms for colloquial variations.
- RTL-aware display of search results.

### English Search
- Index English text fields (name_en, description_en, features_en).
- Standard English stemming.
- Full typo tolerance.

### Mixed Search
- Users may type mixed Arabic/English: "12oz كوب ورقي".
- Split query into Arabic tokens and English tokens.
- Arabic tokens searched against Arabic fields.
- English tokens searched against English fields and numerical fields.
- Results from both searches merged and re-ranked.

## Failure Recovery

| Failure Mode | Detection | Recovery |
|-------------|-----------|----------|
| Search provider down | Health check timeout (5s) | Fallback to database search (basic text matching). Show degraded banner. Auto-recover when health check passes. |
| Index stale | Version mismatch between source data and indexed document | Queue reindex for affected documents. Background worker processes queue. |
| Reindex failing mid-way | Progress stall > 5 min | Abort reindex. Revert to previous index. Restart reindex from last checkpoint. |
| Provider migration | No errors | Dual-write to both providers for 30 days. Validate query parity. Cut over when confidence > 99%. |

---

# DELIVERABLE #5: PRICING ENGINE

## Pricing Pipeline

Pricing is not a stored value. It is the **result of a pipeline computation** applied to a base price.

```
Pipeline Stage                          Priority    Override Behavior
─────────────────────────────────────────────────────────────────────
1.  Base Price                          Always      The foundation price
2.  ↓ Wholesale Price                   Customer    Replaces base if customer
                                        Group       is wholesale
3.  ↓ Tier Pricing                      Quantity    Replaces base if quantity
                                                    meets tier threshold
4.  ↓ Campaign Price                    Campaign    Overrides if active campaign
                                                    targets this product/customer
5.  ↓ Customer Group Discount           Customer    Percentage discount applied
                                        Group       on top of current running price
6.  ↓ Coupon Code                       Order       Percent or fixed discount
                                                    on top of current running price
7.  ↓ Tax                               Location    Added to current running price
                                                    (inclusive or exclusive)
8.  ↓ Shipping Cost                     Order       Added to current running price
                                                    (or free above threshold)
9.  ↓ FINAL PRICE                                   Result returned to customer
```

## Priority and Override Rules

| Rule | Effect |
|------|--------|
| A later stage ALWAYS overrides an earlier stage | Campaign > Tier > Wholesale > Base |
| Coupons can stack with campaign prices if configured | Campaign price + coupon discount = final before tax |
| Tax is additive (never overrides) | Added last |
| Shipping is additive (never overrides) | Added before final |
| Override cannot go below zero | Minimum final price is 0 |

## Conflict Resolution

| Conflict | Resolution |
|----------|------------|
| Campaign price AND tier pricing apply simultaneously | Cheaper of the two wins (customer gets the better deal) |
| Two campaigns target the same product | Most recently activated campaign wins |
| Coupon AND wholesale price | Both apply (wholesale first, then coupon discount on top) |
| Tax inclusive vs exclusive | Configurable per region. If inclusive, tax is not added to the displayed price but is itemized on invoice. |
| Customer has multiple group memberships | Apply the group discount with the highest percentage |

## Caching Strategy

| Cache Level | TTL | Invalidation |
|-------------|-----|-------------|
| Base price | 1 hour | On price change event |
| Tier prices | 1 hour | On price tier change |
| Campaign price | 5 minutes | Campaign start/end events |
| Customer group discount | 1 hour | Rarely changes |
| Tax rate | 24 hours | Rarely changes (jurisdiction-based) |
| Final calculated price | 5 minutes | Any upstream change |

Cache key: `price:{packagingUnitId}:{customerGroupId}:{quantity}:{location}:{couponCode}`

## Future Promotions Engine Integration

```
Pricing Pipeline ──> Checks Promotions Context for active campaigns
                         │
                         v
                  ┌──────────────┐
                  │  Promotions   │
                  │  Context      │
                  │               │
                  │ Returns:      │
                  │  campaignPrice│
                  │  discount%    │
                  │  couponRules  │
                  └──────────────┘

Events:
  PromotionActivated     → Invalidate campaign price cache
  PromotionExpired       → Invalidate campaign price cache
  PriceChangeRequested   → Invalidate base/tier price cache
```

---

# DELIVERABLE #6: INVENTORY DOMAIN

## Inventory State Machine

```
                    ┌──────────┐
                    │ Expected  │  (future: known inbound but not yet received)
                    └────┬─────┘
                         │ receive
                         v
                    ┌──────────┐
           ┌───────>│ Available │<────────┐
           │        └─────┬────┘         │
           │              │               │
        return         reserve          un-reserve
           │              │               │
           │        ┌─────v────┐          │
           │        │ Reserved  │─────────┘
           │        └─────┬────┘
           │              │ allocate (on shipment creation)
           │              │
           │        ┌─────v────┐
           │        │ Allocated │
           │        └─────┬────┘
           │              │ ship (confirm departure)
           │              │
           │        ┌─────v────┐ ────> Quarantine (if damaged in transit)
           │        │ Shipped   │
           │        └─────┬────┘
           │              │ deliver
           │              │
           │        ┌─────v────┐
           └────────│ Consumed  │  (exits system)
                    └──────────┘

Other states:
  Incoming    ──> Available (stock receipt from supplier)
  Available   ──> Damaged (discovered during cycle count)
  Available   ──> Quarantined (quality hold)
  Quarantined ──> Available (released)
  Quarantined ──> Damaged (confirmed)
  Available   ──> Lost (cycle count discrepancy)
  Returned    ──> Available (customer return, restockable)
  Returned    ──> Damaged (customer return, non-restockable)
```

### State Descriptions

| State | Definition | Sellable? |
|-------|-----------|-----------|
| **Expected** | Purchase order placed, stock not yet received | No |
| **Incoming** | Stock received at warehouse, not yet scanned into system | No |
| **Available** | Physically present, sellable | Yes |
| **Reserved** | Allocated to a pending order in cart | No (for other customers) |
| **Allocated** | Assigned to a confirmed order, picked and packed | No |
| **Shipped** | Departed warehouse, in transit to customer | No |
| **Consumed** | Delivered and accepted by customer, exits inventory | No |
| **Damaged** | Physically damaged, not sellable | No |
| **Returned** | Customer return received, pending inspection | No (until inspected) |
| **Quarantined** | Quality hold, awaiting inspection decision | No |
| **Lost** | Inventory discrepancy, write-off | No |

## State Transition Rules

| From | To | Triggered By | System Action |
|------|----|-------------|---------------|
| Expected | Incoming | Supplier delivery notification | Create receipt record |
| Incoming | Available | Warehouse scan of received items | Update quantity on hand |
| Available | Reserved | Customer adds to cart (set timeout) | Decrement available, increment reserved |
| Available | Damaged | Cycle count / quality check | Trigger investigation |
| Available | Quarantined | Quality hold order | Block sales |
| Reserved | Available | Cart timeout / customer removes from cart | Release reservation |
| Reserved | Allocated | Order confirmed + pick list generated | Assign to order |
| Allocated | Shipped | Carrier scan at pickup | Trigger ShipmentCreated event |
| Allocated | Available | Pick failure (item damaged in picking) | Return to available, trigger order exception |
| Shipped | Consumed | Customer delivery confirmation | Finalize |
| Shipped | Returned | Customer initiates return | Create return record |
| Returned | Available | Inspection passes, item restockable | Update quantity |
| Returned | Damaged | Inspection fails | Write off |
| Quarantined | Available | Quality inspection passes | Release hold |
| Quarantined | Damaged | Quality inspection fails | Write off |
| Available | Lost | Cycle count discrepancy (short) | Investigate, potential write-off |

## Reservation Rules

1. **Reservation is time-bound**: Reserved stock expires after 30 minutes (cart abandonment timeout). After expiry, the item returns to Available.
2. **Reservation is optimistic**: Multiple customers can have the same item reserved simultaneously (last one to checkout gets the stock; others get a notification).
3. **Reservation quantity must be available**: Reserve can only be created if `Available >= requested quantity`.
4. **Bulk orders reserve the full quantity**: If a customer orders 10 cases, all 10 are reserved at once.

## Order Allocation

```
Order Placed
    │
    v
Validate all line items have sufficient Available stock
    │
    ├── All Available → Create Reservations → Confirm Order → Allocate
    │
    └── Some Unavailable → Partial fulfillment:
        - Available items → Reserve → Allocate → Ship
        - Unavailable items → Backorder → Notify customer
        - If none available → Hold order → Notify customer
```

## Future Multi-Warehouse Support

```
Inventory becomes: Inventory(packagingUnitId, warehouseId)

Warehouse types:
  - Primary (main fulfillment center)
  - Regional (closer to customers, faster delivery)
  - Supplier (stock held at supplier warehouse, dropshipped)
  - Returns (incoming returns processing center)

Stock lookup becomes: sum(Inventory.available) across all warehouses

Allocation strategy (configurable):
  - Nearest warehouse (reduces shipping time/cost)
  - Primary first (consolidates fulfillment)
  - Load-balanced (distribute across warehouses)
  - Supplier (for dropship items)
```

## Stock Integrity

1. **Stock movements are immutable** — every change is a new record, never an update.
2. **Audit trail** — every movement records: who, what, when, why, before/after values.
3. **Double-entry** — every movement has a counter-entry. Stock received from supplier = inventory increase + accounts payable.
4. **Cycle counting** — periodic partial counts to verify system accuracy.
5. **Reconciliation** — system expected vs. physical count. Discrepancies trigger investigation.
6. **FIFO/LIFO tracking** — for cost accounting, track which received batch is being shipped.

---

# DELIVERABLE #7: COLLECTIONS CONTEXT

## Why Collections Are NOT Part of the Core Catalog

Collections serve a fundamentally different purpose than the core catalog:

| Dimension | Core Catalog | Collections |
|-----------|-------------|-------------|
| **Purpose** | Taxonomy and product definition | Merchandising and marketing |
| **Stability** | Rarely changes (months/years) | Changes frequently (weeks/days) |
| **Owner** | Catalog/Product team | Marketing/Sales team |
| **Structure** | Hierarchical (tree) | Flat or tag-based |
| **Business rules** | Product families must exist before they can be found | Collections can mix families from different categories |
| **Lifecycle** | Permanent (until discontinued) | Temporal (campaign periods, seasons) |
| **Validation** | A family must belong to a category | A collection can be empty (draft) |
| **Cross-cutting** | Category tree is single-parent | Family can be in multiple collections |
| **Data ownership** | Core domain entity | Marketing projection |

### What Collections ARE

- A **curated list** of product families for a specific business segment.
- A **themed grouping** for marketing campaigns.
- A **projection** of the catalog — they do not own the product families they reference.
- A **temporal arrangement** — collections can have start/end dates.

### What Collections ARE NOT

- Not a replacement for categories.
- Not a source of truth for product-family relationships.
- Not permanent — they can be deleted without affecting the catalog.
- Not navigational — they are entry points, not the structural taxonomy.

### Implications

```
COLLECTION CAN:                          COLLECTION CANNOT:
  Reference any ProductFamily by ID        Own or modify a ProductFamily
  Group families across categories         Define variant dimensions
  Have a marketing description             Define specs or certifications
  Have a seasonal/time-bound range         Change product pricing
  Target specific customer groups          Change inventory
  Be created by marketing team             Be referenced by Orders
  Be deleted without data loss             Be required for any business process
```

### New Home for Collections

Collections belong in a **Merchandising** or **Marketing** bounded context (future implementation — not part of the current scope).

```
┌────────────────────────────────────────────┐
│         MERCHANDISING CONTEXT              │
│  (Future — Post-MVP)                      │
│                                            │
│  Owns:                                     │
│    Collection                              │
│    CollectionItem (FK → ProductFamily)     │
│    CollectionSchedule (start/end dates)    │
│    CollectionTarget (customer groups)      │
│                                            │
│  Events Published:                         │
│    CollectionCreated                       │
│    CollectionActivated                     │
│    CollectionExpired                       │
│    CollectionItemAdded                     │
│    CollectionItemRemoved                   │
│                                            │
│  Dependencies:                             │
│    Products context (read families)        │
│    Search context (index collections)      │
└────────────────────────────────────────────┘
```

For **MVP**, collections can be a **simple static configuration** (JSON file or database table with minimal fields), explicitly documented as "will move to Merchandising context in post-MVP."

---

# DELIVERABLE #8: DOMAIN EVENTS

## Event Catalog

### Auth Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `UserRegistered` | Auth | Notifications, Customers | user_id, email, role |
| `UserLoggedIn` | Auth | Analytics, Customers | user_id, timestamp |
| `UserLoggedOut` | Auth | Analytics | user_id, timestamp |
| `UserRoleChanged` | Auth | Administration (audit) | user_id, old_role, new_role |
| `UserSuspended` | Auth | Notifications | user_id, reason |

### Catalog Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `CategoryCreated` | Catalog | Search, Analytics | category_id, name, slug |
| `CategoryMoved` | Catalog | Search | category_id, old_parent_id, new_parent_id |
| `CategoryDeactivated` | Catalog | Search, Products | category_id |
| `BrandRegistered` | Catalog | Search | brand_id, name |
| `BrandMerged` | Catalog | Products | old_brand_id, new_brand_id |

### Products Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `ProductFamilyCreated` | Products | Search, Recommendations, Analytics | family_id, name, category_id, brand_id |
| `ProductFamilyPublished` | Products | Search, Notifications (if new) | family_id |
| `ProductFamilyUpdated` | Products | Search | family_id, changed_fields |
| `ProductFamilyDiscontinued` | Products | Search, Orders | family_id |
| `ProductFamilyArchived` | Products | Search | family_id |
| `VariantCreated` | Products | Search, Pricing, Inventory | variant_id, family_id, sku |
| `VariantActivated` | Products | Search | variant_id |
| `VariantDeactivated` | Products | Search, Orders | variant_id, reason |
| `VariantDiscontinued` | Products | Search, Orders | variant_id |
| `DimensionAddedToFamily` | Products | Search | family_id, dimension_id, dimension_name |
| `CompatibilityCreated` | Products | Recommendations, Search | source_family_id, target_family_id, type |
| `CompatibilityDeactivated` | Products | Recommendations, Search | compatibility_id |
| `CompatibilityUpdated` | Products | Recommendations, Search | compatibility_id, old_type, new_type |

### Pricing Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `BasePriceSet` | Pricing | Search, Analytics | packaging_unit_id, amount, currency |
| `PriceTierCreated` | Pricing | Search | packaging_unit_id, tier_label, min_qty, amount |
| `PriceTierUpdated` | Pricing | Search | tier_id, old_amount, new_amount |
| `CampaignPriceActivated` | Pricing | Search, Promotions | packaging_unit_id, campaign_price, valid_from, valid_to |
| `CampaignPriceExpired` | Pricing | Search | packaging_unit_id |

### Inventory Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `InventoryAdjusted` | Inventory | Search, Notifications | packaging_unit_id, warehouse_id, qty_change, new_available, reason |
| `InventoryReserved` | Inventory | Orders | packaging_unit_id, reservation_id, qty |
| `InventoryReleased` | Inventory | Orders | reservation_id, reason |
| `InventoryCommitted` | Inventory | Orders, Shipping | packaging_unit_id, order_id, qty |
| `LowStockAlert` | Inventory | Notifications, Administration | packaging_unit_id, current_qty, threshold |
| `OutOfStockAlert` | Inventory | Notifications, Search | packaging_unit_id |
| `StockMovementRecorded` | Inventory | Analytics | movement_id, direction, qty, reason |
| `InventoryCountCompleted` | Inventory | Analytics | warehouse_id, discrepancies_found |

### Orders Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `OrderPlaced` | Orders | Payments, Inventory, Notifications, Analytics, Recommendations | order_id, customer_id, items[], totals |
| `OrderConfirmed` | Orders | Inventory, Shipping | order_id |
| `OrderShipped` | Orders | Notifications, Analytics | order_id, carrier, tracking_number |
| `OrderDelivered` | Orders | Notifications, Analytics | order_id, delivery_date |
| `OrderCancelled` | Orders | Inventory (release), Payments (refund), Notifications | order_id, reason |
| `OrderReturnRequested` | Orders | Notifications, Administration | order_id, return_reason |
| `OrderReturnApproved` | Orders | Payments (refund), Inventory | order_id, return_id |
| `OrderRefunded` | Orders | Notifications | order_id, refund_amount |

### Payments Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `PaymentInitiated` | Payments | Orders | order_id, payment_id, amount |
| `PaymentCompleted` | Payments | Orders, Notifications | order_id, payment_id |
| `PaymentFailed` | Payments | Orders, Notifications | order_id, payment_id, failure_reason |
| `PaymentRefunded` | Payments | Orders, Notifications | order_id, refund_id, amount |

### Shipping Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `ShipmentCreated` | Shipping | Orders, Notifications | shipment_id, order_id, carrier |
| `ShipmentInTransit` | Shipping | Notifications | shipment_id, location |
| `ShipmentDelivered` | Shipping | Orders, Notifications | shipment_id, delivery_date |
| `ShipmentDelayed` | Shipping | Notifications | shipment_id, new_expected_date |
| `ShipmentFailed` | Shipping | Orders, Notifications, Administration | shipment_id, reason |

### Promotions Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `PromotionActivated` | Promotions | Pricing, Search, Notifications | campaign_id, rules[], discount |
| `PromotionExpired` | Promotions | Pricing, Search | campaign_id |
| `CouponCodeRedeemed` | Promotions | Analytics, Orders | coupon_code, order_id |

### Search Context

| Event | Publisher | Consumers | Payload |
|-------|-----------|-----------|---------|
| `SearchIndexUpdated` | Search | None (logging) | provider, document_count |
| `SearchHealthDegraded` | Search | Administration, Notifications | provider, reason |

## Ordering Guarantees

| Guarantee Level | Events | Mechanism |
|-----------------|--------|-----------|
| **Exactly-once** | Order, Payment, Inventory adjustments | Idempotency key on event ID. Consumer must deduplicate by event_id before processing. |
| **At-least-once** | Search index updates, Notifications | Consumer retries on failure. Idempotent processing (updating a search index with the same document is safe). |
| **At-most-once** | Analytics events | Loss acceptable. No retry. |

## Idempotency

Every event carries a unique `event_id` (UUID). Consumers must:

```
1. Check if event_id has already been processed (deduplication table).
2. If processed: ACK without re-processing.
3. If new: process and record event_id as processed.
4. Retention: keep event_id dedup records for 30 days.
```

## Failure Handling

| Failure | Consumer Behavior | Recovery |
|---------|------------------|----------|
| Consumer crashes mid-processing | Event remains in queue. Re-delivered on restart. | Idempotency ensures safe re-processing. |
| Consumer throws exception | Retry 3 times with backoff (1s, 5s, 30s). After 3 failures → dead letter queue. | Admin reviews dead letter queue, fixes issue, replays. |
| Event bus unavailable | Publisher fails to publish (configurable: fail open or fail closed). | Retry queue on publisher side. Exponential backoff (1s, 2s, 4s, 8s, max 60s). |
| Dependent service down | Consumer retries with backoff. | Circuit breaker after 5 consecutive failures. Half-open after 30s. |

---

# DELIVERABLE #9: ARCHITECTURAL SELF REVIEW

## Weaknesses

1. **Complexity of the dimension system** — The flexible `VariantDimension`/`VariantDimensionValue` system introduces significant complexity. Every category needs dimension definitions. This requires robust admin tooling and training.

2. **Eventual consistency complexity** — With 16 bounded contexts communicating primarily through events, there are numerous eventual consistency scenarios that must be carefully handled. Example: a product is published → search index updated → customer searches before index is updated → stale results.

3. **Pricing pipeline computational cost** — Computing the final price through 9 pipeline stages for every product every time requires caching at every stage. If a cache layer is missed, page load times degrade significantly.

4. **Compatibility graph traversal at scale** — Finding all compatible products for a given family requires traversing the graph. At >10K families with multiple connections each, this becomes expensive if not indexed properly.

5. **Bilingual content overhead** — Every text field existing in both Arabic and English doubles content management effort and introduces inconsistency risks (updating one language but not the other).

6. **No caching strategy defined for catalog queries** — The architecture describes what caching should happen but doesn't define a strategy for catalog page queries that join families, variants, dimensions, and inventory.

## Trade-offs

| Decision | Trade-off | Accepted Risk |
|----------|-----------|---------------|
| 16 bounded contexts | More infrastructure, more event contracts, more deployment complexity | Enables independent team ownership and independent scaling |
| Event-driven communication | Eventual consistency, debugging difficulty | Decoupled services that can evolve independently |
| PackagingUnit immutability | More records, more historical data, more complex migration paths | Absolute order integrity forever |
| Search provider abstraction | Cannot use provider-specific features fully without leaking abstraction | Ability to switch providers without application changes |
| ProductFamily as aggregate root | More complex than flat Product, requires understanding hierarchy | Correct domain model for packaging — flat Product would cause more pain long-term |
| Collections outside core catalog | Collections cannot have domain validation | Marketing agility without touching catalog integrity |
| Tiered pricing pipeline | More computational complexity, cache dependencies | Correct pricing for B2B bulk purchasing |
| Spanish catalog | Bilingual = double the data entry | Correct for serving KSA market (Arabic required by law in many cases) |

## Future Risks

1. **Admin UI under-investment** — The dimension system, compatibility graph, pricing pipeline all require a powerful admin interface. If the admin UI is built as an afterthought, catalog management becomes painful and error-prone. Catalog quality degrades → customer trust degrades.

2. **Search vendor lock-in (despite abstraction)** — While the `ISearchService` interface is abstract, each provider has unique features that the abstraction may not capture. The team may be tempted to use provider-specific features, creating implicit lock-in.

3. **Event schema evolution** — As the product evolves, event payloads will need to change. Without a schema registry or versioning strategy, consumers can break silently when producers add/remove fields.

4. **Pricing pipeline becomes a bottleneck** — If every price lookup at checkout goes through the full 9-stage pipeline without proper caching, checkout performance will degrade. At peak traffic (promotions, holidays), this becomes critical.

5. **Inventory reservation timeout race conditions** — The 30-minute cart reservation timeout means high-demand items could be reserved but never purchased. Competing checkouts for the last available unit could lead to order failures.

6. **Multi-warehouse transition** — The current architecture is single-warehouse. Adding multi-warehouse support will require significant changes to Inventory, Shipping, and potentially Orders contexts. Early architecture decisions should anticipate this (which this architecture does).

## Performance Bottlenecks

| Bottleneck | Context | Mitigation |
|------------|---------|------------|
| Category page loading 24 product families with variants | Catalog + Products | Denormalized view for listing pages. Search-powered category browsing. |
| Compatibility graph traversal | Products | Adjacency list cached in Redis. Graph DB only if >10K families. |
| Final price calculation × 24 products | Pricing | Cache calculated prices. Warm cache on price change events. |
| Inventory availability × 24 items | Inventory | Cache available counts. 5-second staleness acceptable for browsing. Real-time only at cart/checkout. |
| Search with complex facet counts | Search | Facet counts are cached and pre-computed. Incremental updates on data changes. |
| Order placement (inventory reserve + payment + notification) | Multiple contexts | Saga pattern with timeout and compensation. Async where possible. |

## Scaling Concerns

| Scale | Concern | Mitigation |
|-------|---------|------------|
| 10M products (5K families × 200 variants each) | Variant dimension join explosion | Variant search index. Not SQL joins for browsing. |
| 100K orders/day | Inventory reservation contention | Partition inventory by region. Batch reservation processing. |
| 1M searches/day | Search provider cost and latency | Horizontal scaling of search provider. CDN caching of popular searches. |
| 50 warehouses | Inventory record explosion | Shard inventory by region. Aggregate view for national stock. |
| 200 catalog managers concurrently | Catalog edit conflicts | Optimistic locking on ProductFamily version. Conflict UI for merges. |
| 10 languages | Content management complexity | Separate translation service. Language-agnostic core data. |

## Migration Complexity

| From (current) | To (target) | Difficulty | Strategy |
|----------------|------------|------------|----------|
| Flat Product entity | ProductFamily + Variant + PackagingUnit | HIGH | Dual-write during migration. New code paths use new model. Old order history references flat Product. Migration script to populate new model from flat data. |
| Single pricing field | Tiered pricing pipeline | MEDIUM | Start with list-only pricing (single tier). Add tiers incrementally. Campaign pricing requires Promotions context. |
| Basic search | Provider-abstraction search | MEDIUM | Build abstraction layer first with one provider (Typesense). Index existing products. A/B test search quality. |
| Wishlist | Compatibility + FBT | LOW (wishlist deletion) | Delete wishlist code. FBT requires order history (seeded manually initially). |
| Current catalog | New taxonomy | MEDIUM | Map old categories to new. Most will map to subcategories. Collections created manually for MVP. |
| Current admin | Catalog management | HIGH (new build) | Admin UI built after core domain model is stable. MVP uses direct DB or simple CRUD screens. |

## Technical Debt Identification

| Debt | Source | Severity | Resolution Timeline |
|------|--------|----------|-------------------|
| Flat Product in existing codebase | Previous e-commerce architecture | HIGH | Migrate to hierarchical model before adding new product families |
| Mock data in storefront feature | Rapid prototyping | MEDIUM | Delete during storefront rewrite |
| No test files | Pre-MVP state | HIGH | Test strategy must accompany implementation |
| Empty barrel files | Scaffolding | LOW | Remove or populate during implementation |
| Wishlist store and service | Lifestyle e-commerce pattern | LOW (standalone) | Delete entirely, no migration needed |
| Newsletter schema and components | Lifestyle pattern | LOW | Delete |
| Marketing hero/sections on homepage | Lifestyle pattern | LOW | Delete, replace with dashboard |

## What Would Change with 10 Million Products

1. **Search becomes THE catalog** — At 10M products, you do not browse categories. You search. The category page becomes a faceted search result page. The entire catalog is a search index.

2. **Variant dimension values need their own search index** — Joining a variant to 10M sibling dimension values in a relational DB becomes impractical. Dimension values move into the search index.

3. **Compatibility graph needs a dedicated graph database** — Neo4j or Amazon Neptune. The in-memory adjacency list approach fails above 100K families.

4. **Pricing pipeline needs per-customer pre-calculated pricing** — Running the 9-stage pipeline per product per page load is too expensive. Pre-calculate pricing for known customer segments nightly. Cache aggressively.

5. **Inventory becomes a time-series database** — Stock movements at scale are better served by a time-series DB (InfluxDB, TimescaleDB) than a relational audit log.

6. **Catalog becomes read-only for customers** — All catalog page requests hit a CDN-cached, pre-rendered static version. Updates invalidate cache entries.

7. **Event bus becomes mandatory infrastructure** — At this scale, the event bus is not optional. Every context communicates asynchronously. Synchronous dependencies are eliminated.

## What Changes with Manufacturing Expansion

If the company starts **manufacturing** its own packaging (vs. distributing):

1. **New Bounded Context**: Manufacturing — manages production runs, raw materials, batch tracking, quality control, production schedules.

2. **Product lifecycle expands**: `ProductFamily` gets a `manufacturingSpecifications` section (raw material BOM, production steps, quality checks).

3. **Inventory bifurcates**: Raw materials inventory + Finished goods inventory. The current Inventory context handles finished goods. Raw materials need a separate context (or extension).

4. **New Event**: `BatchProduced` — triggers inventory addition, quality review, cost calculation.

5. **Cost price becomes dynamic**: Instead of a supplier invoice cost, the `costPrice` is calculated from raw material costs + labor + overhead. This feeds into the pricing pipeline.

6. **Compatibility expands**: Manufacturing requires raw material compatibility (which paper stock works with which PE lining).

## What Changes with Multi-Country Expansion

If the company expands to UAE, Egypt, and other markets:

1. **New Bounded Context**: Localization — manages per-country pricing, tax rules, shipping configurations, language translations, regulatory compliance.

2. **Pricing pipeline gains a country stage**: `Base price → Country markup → Local tax → Local shipping`.

3. **Inventory becomes per-country**: Separate warehouses per country. Cross-border inventory tracking.

4. **Compatibility may differ**: Some products are compatible in one market but not another (different regulations).

5. **Search needs locale-aware ranking**: Search results should prioritize locally available stock and local language results.

6. **New Entity**: `Market` — a country/region with its own pricing, inventory, shipping rules, and regulations.

7. **Category structure may differ**: Food service regulations differ by country. Some categories exist in one market but not another.

## What Changes with Supplier Self-Service

If suppliers can manage their own products in the catalog:

1. **New Bounded Context**: Supplier Portal — manages supplier onboarding, product submissions, self-service catalog management.

2. **ProductFamily gains an owner**: `ownedBy: supplier_id | platform`. Supplier-owned families have different lifecycle rules.

3. **Approval workflow**: Supplier submits a product → PENDING_APPROVAL → Platform approves → PUBLISHED. This requires the Administration context to handle review queues.

4. **Multi-sourcing**: One product family could have variants from different suppliers (same spec, different source). This requires `Supplier` as a variant-level attribute.

5. **Compatibility becomes multi-supplier**: Supplier A's lids must be compatible with Supplier B's cups. The compatibility engine must work across suppliers.

6. **Inventory becomes supplier-aware**: Stock is tracked per supplier. Orders may be fulfilled from multiple suppliers (split shipment).

7. **Data quality challenges**: Suppliers may submit incomplete or incorrect specifications. Validation rules at the Supplier Portal boundary become critical.

## Final Assessment

### Strengths
- Correct domain model for packaging commerce
- Clear bounded context separation
- Compatibility as first-class graph
- Search abstraction prevents vendor lock-in
- PackagingUnit immutability ensures order integrity
- Event-driven architecture enables decoupled evolution
- Pricing pipeline handles B2B complexity
- Inventory states support warehouse logistics
- Collections rightly separated from core catalog

### Weaknesses
- High complexity in variant dimension system
- Eventual consistency management is non-trivial
- Admin tooling is a critical dependency
- Bilingual content overhead
- No caching strategy detailed for catalog queries

### Verdict

The architecture is **correct and enterprise-ready** for a packaging commerce platform. The hierarchical ProductFamily → Variant → PackagingUnit model is the right foundation. The bounded context separation enables independent team ownership. The event-driven design supports future growth into manufacturing, multi-country, and supplier self-service.

**The architecture passes enterprise review.**

Begin implementation when approved.
