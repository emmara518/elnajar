// Shared
export type { Entity, ValueObject } from './shared';

// Types
export type {
  SaleStatus,
  PaymentStatus,
  PaymentMethod,
  ShiftStatus,
  MovementType,
  ExpenseCategory,
  PurchaseStatus,
  CustomerType,
  ProductType,
  DiscountType,
  TaxType,
  AuditAction,
} from './types';

// Value Objects
export type { Money, Quantity, Phone, Email, Address, GeoLocation, Percentage, Barcode, BarcodeType, SKU, TaxRate, Discount, DateRange } from './value-objects';
export { createMoney, addMoney, multiplyMoney, formatMoney } from './value-objects';
export { createQuantity, addQuantity, subtractQuantity } from './value-objects';
export { createPhone } from './value-objects';
export { createEmail } from './value-objects';
export { createAddress } from './value-objects';
export { createPercentage, applyPercentage, percentageToDecimal } from './value-objects';
export { createBarcode } from './value-objects';
export { createSKU } from './value-objects';
export { createTaxRate, calculateTax } from './value-objects';
export { createPercentageDiscount, createFixedDiscount, applyDiscount } from './value-objects';
export { createDateRange, isInRange, rangeDuration } from './value-objects';

// Entities
export type {
  User, CreateUserPayload,
  Employee, CreateEmployeePayload,
  Role, CreateRolePayload,
  Permission, CreatePermissionPayload,
  Branch, CreateBranchPayload,
  Customer, CreateCustomerPayload,
  Supplier, CreateSupplierPayload,
  Category, CreateCategoryPayload,
  Product, CreateProductPayload,
  InventoryItem, CreateInventoryItemPayload,
  StockMovement, CreateStockMovementPayload,
  Sale, CreateSalePayload,
  SaleItem, CreateSaleItemPayload,
  Payment, CreatePaymentPayload,
  Shift, CreateShiftPayload,
  Expense, CreateExpensePayload,
  Purchase, CreatePurchasePayload,
  PurchaseItem, CreatePurchaseItemPayload,
  AuditLog, CreateAuditLogPayload,
  Company, CreateCompanyPayload,
  Settings, CreateSettingsPayload,
} from './entities';

// Aggregates
export type { SaleAggregate, PurchaseAggregate, ShiftAggregate, ProductAggregate } from './aggregates';

// Repositories
export type {
  UserRepository, EmployeeRepository, RoleRepository, PermissionRepository,
  BranchRepository, CustomerRepository, SupplierRepository, CategoryRepository,
  ProductRepository, InventoryItemRepository, StockMovementRepository,
  SaleRepository, PaymentRepository, ShiftRepository, ExpenseRepository,
  PurchaseRepository, AuditLogRepository, CompanyRepository, SettingsRepository,
} from './repositories';

// Events
export type { DomainEvent } from './events';
export type {
  UserCreated, EmployeeCreated, EmployeeRoleChanged,
  ProductCreated, ProductUpdated, ProductDeleted, CategoryCreated,
  InventoryAdjusted, LowStockDetected, StockReceived,
  SaleCreated, SaleConfirmed, SaleCancelled, SaleCompleted,
  ShiftOpened, ShiftClosed,
  PurchaseOrdered, PurchaseReceived,
  ExpenseRecorded, PaymentVerified,
} from './events';

// Services
export type {
  PricingService, InventoryService, TaxService, DiscountService, BarcodeService,
} from './services';

// Factories
export type {
  SaleFactory, PurchaseFactory, ShiftFactory, ProductFactory,
} from './factories';
