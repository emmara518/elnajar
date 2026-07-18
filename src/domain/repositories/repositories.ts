import type { ApiResponse, ApiListResponse } from '@/types';
import type {
  User, Employee, Role, Permission, Branch, Customer, Supplier, Category,
  Product, InventoryItem, StockMovement, Sale, Payment, Shift,
  Expense, Purchase, PurchaseItem, AuditLog, Company, Settings,
} from '../entities';
import type { SaleAggregate, PurchaseAggregate, ShiftAggregate } from '../aggregates';
import type { PaginationParams } from '@/types';

export interface UserRepository {
  getById(id: string): Promise<ApiResponse<User>>;
  getByEmail(email: string): Promise<ApiResponse<User>>;
  list(params: PaginationParams): Promise<ApiListResponse<User>>;
  create(data: Partial<User>): Promise<ApiResponse<User>>;
  update(id: string, data: Partial<User>): Promise<ApiResponse<User>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
}

export interface EmployeeRepository {
  getById(id: string): Promise<ApiResponse<Employee>>;
  getByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<Employee>>;
  list(params: PaginationParams): Promise<ApiListResponse<Employee>>;
  create(data: Partial<Employee>): Promise<ApiResponse<Employee>>;
  update(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
}

export interface RoleRepository {
  getById(id: string): Promise<ApiResponse<Role>>;
  list(params: PaginationParams): Promise<ApiListResponse<Role>>;
  create(data: Partial<Role>): Promise<ApiResponse<Role>>;
  update(id: string, data: Partial<Role>): Promise<ApiResponse<Role>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface PermissionRepository {
  getById(id: string): Promise<ApiResponse<Permission>>;
  list(params: PaginationParams): Promise<ApiListResponse<Permission>>;
  getByGroup(group: string): Promise<ApiListResponse<Permission>>;
}

export interface BranchRepository {
  getById(id: string): Promise<ApiResponse<Branch>>;
  list(params: PaginationParams): Promise<ApiListResponse<Branch>>;
  create(data: Partial<Branch>): Promise<ApiResponse<Branch>>;
  update(id: string, data: Partial<Branch>): Promise<ApiResponse<Branch>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
}

export interface CustomerRepository {
  getById(id: string): Promise<ApiResponse<Customer>>;
  list(params: PaginationParams): Promise<ApiListResponse<Customer>>;
  create(data: Partial<Customer>): Promise<ApiResponse<Customer>>;
  update(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
  getByUserId(userId: string): Promise<ApiResponse<Customer>>;
}

export interface SupplierRepository {
  getById(id: string): Promise<ApiResponse<Supplier>>;
  list(params: PaginationParams): Promise<ApiListResponse<Supplier>>;
  create(data: Partial<Supplier>): Promise<ApiResponse<Supplier>>;
  update(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
}

export interface CategoryRepository {
  getById(id: string): Promise<ApiResponse<Category>>;
  list(params: PaginationParams): Promise<ApiListResponse<Category>>;
  getTree(): Promise<ApiListResponse<Category>>;
  create(data: Partial<Category>): Promise<ApiResponse<Category>>;
  update(id: string, data: Partial<Category>): Promise<ApiResponse<Category>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface ProductRepository {
  getById(id: string): Promise<ApiResponse<Product>>;
  getBySlug(slug: string): Promise<ApiResponse<Product>>;
  getBySku(sku: string): Promise<ApiResponse<Product>>;
  list(params: PaginationParams): Promise<ApiListResponse<Product>>;
  listByCategory(categoryId: string, params: PaginationParams): Promise<ApiListResponse<Product>>;
  search(query: string, params: PaginationParams): Promise<ApiListResponse<Product>>;
  create(data: Partial<Product>): Promise<ApiResponse<Product>>;
  update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>>;
  softDelete(id: string): Promise<ApiResponse<void>>;
}

export interface InventoryItemRepository {
  getById(id: string): Promise<ApiResponse<InventoryItem>>;
  getByProductAndBranch(productId: string, branchId: string): Promise<ApiResponse<InventoryItem>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<InventoryItem>>;
  listLowStock(branchId: string, threshold: number): Promise<ApiListResponse<InventoryItem>>;
  create(data: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>>;
  update(id: string, data: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>>;
}

export interface StockMovementRepository {
  getById(id: string): Promise<ApiResponse<StockMovement>>;
  listByProduct(productId: string, params: PaginationParams): Promise<ApiListResponse<StockMovement>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<StockMovement>>;
  create(data: Partial<StockMovement>): Promise<ApiResponse<StockMovement>>;
}

export interface SaleRepository {
  getById(id: string): Promise<ApiResponse<SaleAggregate>>;
  getByOrderNumber(orderNumber: string): Promise<ApiResponse<Sale>>;
  listByShift(shiftId: string): Promise<ApiListResponse<Sale>>;
  listByCustomer(customerId: string, params: PaginationParams): Promise<ApiListResponse<Sale>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<Sale>>;
  listByDateRange(start: string, end: string, params: PaginationParams): Promise<ApiListResponse<Sale>>;
  create(sale: SaleAggregate): Promise<ApiResponse<Sale>>;
  updateStatus(id: string, status: string): Promise<ApiResponse<Sale>>;
}

export interface PaymentRepository {
  getById(id: string): Promise<ApiResponse<Payment>>;
  listBySale(saleId: string): Promise<ApiListResponse<Payment>>;
  create(data: Partial<Payment>): Promise<ApiResponse<Payment>>;
  verify(id: string, verifiedById: string): Promise<ApiResponse<Payment>>;
}

export interface ShiftRepository {
  getById(id: string): Promise<ApiResponse<ShiftAggregate>>;
  getCurrentShift(branchId: string, employeeId: string): Promise<ApiResponse<Shift>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<Shift>>;
  listByEmployee(employeeId: string, params: PaginationParams): Promise<ApiListResponse<Shift>>;
  create(data: Partial<Shift>): Promise<ApiResponse<Shift>>;
  close(id: string, closingCash: number): Promise<ApiResponse<Shift>>;
}

export interface ExpenseRepository {
  getById(id: string): Promise<ApiResponse<Expense>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<Expense>>;
  listByDateRange(start: string, end: string, params: PaginationParams): Promise<ApiListResponse<Expense>>;
  create(data: Partial<Expense>): Promise<ApiResponse<Expense>>;
  update(id: string, data: Partial<Expense>): Promise<ApiResponse<Expense>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface PurchaseRepository {
  getById(id: string): Promise<ApiResponse<PurchaseAggregate>>;
  listBySupplier(supplierId: string, params: PaginationParams): Promise<ApiListResponse<Purchase>>;
  listByBranch(branchId: string, params: PaginationParams): Promise<ApiListResponse<Purchase>>;
  create(purchase: PurchaseAggregate): Promise<ApiResponse<Purchase>>;
  updateStatus(id: string, status: string): Promise<ApiResponse<Purchase>>;
  receiveItem(purchaseItemId: string, receivedQuantity: number): Promise<ApiResponse<PurchaseItem>>;
}

export interface AuditLogRepository {
  getById(id: string): Promise<ApiResponse<AuditLog>>;
  listByEntity(entityType: string, entityId: string, params: PaginationParams): Promise<ApiListResponse<AuditLog>>;
  listByDateRange(start: string, end: string, params: PaginationParams): Promise<ApiListResponse<AuditLog>>;
  create(data: Partial<AuditLog>): Promise<ApiResponse<AuditLog>>;
}

export interface CompanyRepository {
  getById(id: string): Promise<ApiResponse<Company>>;
  getCurrent(): Promise<ApiResponse<Company>>;
  update(id: string, data: Partial<Company>): Promise<ApiResponse<Company>>;
}

export interface SettingsRepository {
  getById(id: string): Promise<ApiResponse<Settings>>;
  getByCompany(companyId: string): Promise<ApiResponse<Settings>>;
  getByBranch(branchId: string): Promise<ApiResponse<Settings>>;
  update(id: string, data: Partial<Settings>): Promise<ApiResponse<Settings>>;
}
