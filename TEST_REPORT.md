# AutoVault - Test Report

This document outlines the automated integration testing strategy and coverage for the AutoVault project. Tests were implemented using Jest and Supertest, following a strict Test-Driven Development (TDD) workflow.

## Overview

The testing suite focuses on the backend REST API, ensuring that authentication, authorization, vehicle management, and purchase workflows function correctly and securely.

- **Test Runner:** Jest
- **HTTP Assertions:** Supertest
- **Database:** MongoDB (using a dedicated test database, fully wiped and seeded between test suites)

## Test Suites and Coverage

### 1. Authentication (`/api/auth`)

**User Registration (`register.test.js`)**
- ✅ Should register a user successfully
- ✅ Should return 400 if required fields are missing
- ✅ Should return 400 if email is already in use
- ✅ Should securely hash passwords before saving

```text
    √ should register a user successfully (412 ms)
    √ should return 400 if required fields are missing (123 ms)
    √ should return 400 if email is already in use (210 ms)
    √ should securely hash passwords before saving (305 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.250 s
```

**User Login (`login.test.js`)**
- ✅ Should login successfully with valid credentials and return a JWT
- ✅ Should return 401 for an incorrect password
- ✅ Should return 404 for a non-existent email
- ✅ Should NEVER return the password in the API response payload

```text
    √ should login successfully with valid credentials and return a JWT (280 ms)
    √ should return 401 for an incorrect password (190 ms)
    √ should return 404 for a non-existent email (110 ms)
    √ should NEVER return the password in the API response payload (95 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.100 s
```

### 2. Vehicle Inventory (`/api/vehicles`)

**Public Routes (`getVehicles.test.js`)**
- ✅ Should return a list of all available vehicles
- ✅ Should return a single vehicle by ID
- ✅ Should return 404 for a non-existent vehicle ID

```text
    √ should return a list of all available vehicles (210 ms)
    √ should return a single vehicle by ID (140 ms)
    √ should return 404 for a non-existent vehicle ID (85 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.050 s
```

**Admin Protected Routes (`addVehicle.test.js`, `updateVehicle.test.js`, `deleteVehicle.test.js`)**
- ✅ Should allow an Admin to add a new vehicle
- ✅ Should allow an Admin to update vehicle details (e.g. price, stock)
- ✅ Should allow an Admin to delete a vehicle
- ✅ Should return 403 Forbidden when a standard user attempts these actions
- ✅ Should return 401 Unauthorized when no token is provided

```text
    √ should allow an Admin to add a new vehicle (300 ms)
    √ should allow an Admin to update vehicle details (e.g. price, stock) (285 ms)
    √ should allow an Admin to delete a vehicle (290 ms)
    √ should return 403 Forbidden when a standard user attempts these actions (150 ms)
    √ should return 401 Unauthorized when no token is provided (120 ms)

Test Suites: 3 passed, 3 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.300 s
```

### 3. Inventory Restock (`/api/vehicles/:id/restock`)

**Admin Restock (`restockVehicle.test.js`)**
- ✅ Should allow an Admin to restock a vehicle and increase quantity
- ✅ Should reject negative restock amounts
- ✅ Should enforce Admin-only role authorization

```text
    √ should allow an Admin to restock a vehicle and increase quantity (320 ms)
    √ should reject negative restock amounts (150 ms)
    √ should enforce Admin-only role authorization (160 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.150 s
```

### 4. Purchase Workflow (`/api/vehicles/:id/purchase`)

**User Purchase (`purchaseVehicle.test.js`)**
- ✅ Should allow an authenticated user to purchase an available vehicle
- ✅ Should safely decrease the vehicle stock quantity by exactly 1
- ✅ Should reject purchase with a 400 error if the vehicle quantity is 0 (Out of Stock)
- ✅ Should return 404 if the vehicle ID does not exist
- ✅ Should return 401 if no valid JWT is provided
- ✅ Should create a Purchase history record with the exact `priceAtPurchase` locked in

### 5. Purchase History & Tracking (`/api/users/purchases`)

**User Dashboard Tracking**
- ✅ Should retrieve only the purchase history belonging to the specific authenticated user
- ✅ Should correctly populate the nested vehicle details (make, model, images, etc.)

```text
    √ should retrieve only the purchase history belonging to the specific authenticated user (310 ms)
    √ should correctly populate the nested vehicle details (250 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.200 s
```

---

## Continuous Testing & TDD Workflow

During the development process, the **RED-GREEN-REFACTOR** cycle was strictly enforced:
- **RED Phase:** Integration tests were written first. They were executed to confirm failure (expecting 404s, 500s, or logical assertion failures).
- **GREEN Phase:** The minimal required controller logic, Mongoose models, and Express routes were implemented until Jest reported a passing suite.
- **REFACTOR Phase:** Code was cleaned up (e.g., adding model validations, moving auth checks to reusable middleware) while running Jest continuously to ensure no regressions occurred.

---

