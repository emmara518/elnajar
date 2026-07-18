# Unit Testing

**File:** `docs/testing/02-unit-testing.md`

---

# Purpose

يوضح هذا المستند معايير واستراتيجية **Unit Testing** لجميع وحدات النظام، بهدف ضمان صحة عمل الدوال (Functions)، الخدمات (Services)، الـ Hooks، والمكونات المنفصلة دون الاعتماد على قواعد البيانات أو الخدمات الخارجية.

---

# Objectives

- Verify Business Logic
- Detect Bugs Early
- Prevent Regressions
- Enable Safe Refactoring
- Improve Code Quality
- Maintain High Confidence

---

# Definition

Unit Testing هو اختبار أصغر وحدة مستقلة من الكود.

Examples

- Utility Function
- React Hook
- Service Function
- Validator
- Formatter
- Price Calculator
- Permission Checker

---

# Scope

Covered

- Utilities
- Hooks
- Business Logic
- Validation
- Formatters
- Permission Logic
- API Helpers
- State Stores
- Mappers
- Calculators

Excluded

- Database
- Supabase
- Network Requests
- Browser APIs
- External Services

---

# Recommended Stack

| Purpose | Tool |
|----------|------|
| Test Runner | Vitest |
| Assertions | Vitest Expect |
| Component Utilities | React Testing Library |
| Mocking | vi.mock() |
| Coverage | V8 |
| DOM Environment | jsdom |

---

# Directory Structure

```
src/

    utils/

        price.ts

        price.test.ts

    hooks/

        useCart.ts

        useCart.test.ts

    services/

        cart.service.ts

        cart.service.test.ts

tests/

    setup.ts
```

---

# Naming Convention

Production File

```
price.ts
```

Test File

```
price.test.ts
```

Alternative

```
price.spec.ts
```

---

# Test Structure

Arrange

↓

Act

↓

Assert

Example

```text
Prepare data

↓

Execute function

↓

Verify result
```

---

# Example

```ts
describe("calculateTotal", () => {
    it("calculates total price correctly", () => {
        expect(calculateTotal(5, 20)).toBe(100)
    })
})
```

---

# Utilities Testing

Test

- Currency Formatting
- Date Formatting
- Number Formatting
- Price Calculation
- Discount Calculation
- VAT Calculation
- Slug Generation
- UUID Validation

---

# Validation Testing

Verify

- Email Validation
- Phone Validation
- Password Rules
- Required Fields
- Price Validation
- Quantity Validation
- Image Validation

Edge Cases

- Empty Strings
- Null
- Undefined
- Invalid Formats
- Maximum Length
- Minimum Length

---

# Business Logic

Examples

- Cart Total
- Discount Rules
- Coupon Validation
- Shipping Cost
- Stock Availability
- Inventory Updates
- Order Status Transition

---

# Hooks Testing

Hooks

```
useAuth()

useCart()

useWishlist()

useOrders()

useInventory()
```

Verify

- Initial State
- Updates
- Side Effects
- Error Handling
- Cleanup

---

# Zustand Store Testing

Verify

- Initial State
- Actions
- Reset
- Persistence
- Selectors

---

# Mocking

Mock

- Fetch
- Local Storage
- Session Storage
- Supabase Client
- Browser APIs
- Date
- Random Values

Never Mock

Business Logic

---

# Async Testing

Verify

- Promise Resolution
- Promise Rejection
- Loading State
- Error State

---

# Error Testing

Every Function Must Be Tested For

- Invalid Input
- Missing Data
- Null Values
- Undefined Values
- Exceptions

---

# Edge Cases

Examples

- Empty Cart
- Zero Price
- Negative Quantity
- Duplicate Product
- Maximum Quantity
- Large Numbers

---

# Test Isolation

Every Test Must

- Be Independent
- Reset Mocks
- Avoid Shared State
- Clean Up Resources

---

# Test Lifecycle

Before Each

- Reset Mocks
- Clear Storage
- Reset Stores

After Each

- Cleanup DOM
- Restore Spies
- Reset Timers

---

# Coverage Targets

| Module | Target |
|----------|--------|
| Utilities | 100% |
| Validation | 100% |
| Services | 95% |
| Hooks | 90% |
| Stores | 90% |
| Overall | 90% |

---

# Coverage Rules

Must Cover

- Success Paths
- Failure Paths
- Edge Cases
- Exceptions
- Invalid Input

---

# Performance

Unit Tests Should

- Execute Quickly
- Run In Parallel
- Avoid Network Access
- Avoid File System Access

Expected Runtime

```
< 5 Seconds
```

For Full Suite

---

# CI Integration

Executed

- On Every Commit
- On Every Pull Request
- Before Merge
- Before Release

Failure

↓

Blocks Merge

---

# Reporting

Include

- Passed
- Failed
- Skipped
- Coverage
- Duration

Example

```
Passed: 312

Failed: 0

Coverage: 94.8%

Duration: 2.8 Seconds
```

---

# Common Anti-Patterns

Avoid

- Testing Implementation Details
- Overusing Mocks
- Shared Test State
- Random Test Data
- Time-Dependent Tests
- External Network Calls
- Hardcoded Environment Values

---

# Best Practices

- Test Public Behavior
- Keep Tests Small
- One Assertion Per Behavior
- Use Descriptive Test Names
- Prefer Real Business Logic
- Mock External Dependencies Only
- Cover Edge Cases
- Maintain Deterministic Results
- Refactor Tests With Production Code
- Review Tests During Code Review

---

# Success Criteria

Unit Testing is considered successful when:

- ≥ 90% Overall Coverage
- 100% Critical Business Logic Tested
- No Flaky Tests
- Fast Execution Time
- Zero External Dependencies
- CI Pipeline Passes Consistently
- Deterministic Results Across Environments

---

# Future Enhancements

- Mutation Testing
- Snapshot Review Automation
- AI-Generated Test Cases
- Property-Based Testing
- Automatic Coverage Trend Analysis
- Parallel Test Optimization
- Test Impact Analysis
- Smart Test Selection in CI
- Static Analysis Integration
- Continuous Test Quality Monitoring