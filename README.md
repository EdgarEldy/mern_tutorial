# MERN Tutorial

A hands-on walkthrough of building a full-stack CRUD application with **Express 5 / Node.js** (backend) and **React 19 / Vite** (frontend), organized into Git branches that progressively cover the key concepts of the stack. Adapted here with **MySQL** and **Sequelize ORM** instead of MongoDB, and completed with **JWT authentication**.

The data model follows this EER schema: `categories` -> `products` -> `orders` <- `customers`. A separate `users` table handles authentication.

This document is the **complete specification** of the project and is meant to be followed branch by branch.

Repository: https://github.com/EdgarEldy/fullstack_expressjs_reactjs_tutorial

## Table of contents

- [Tech stack](#tech-stack)
- [Data model](#data-model)
- [Branching strategy](#branching-strategy)
- [Project structure](#project-structure)
- [Standard response format](#standard-response-format)
- [feature/api/core-architecture](#featureapicore-architecture)
- [feature/api/categories](#featureapicategories)
- [feature/api/products](#featureapiproducts)
- [feature/api/customers](#featureapicustomers)
- [feature/api/orders](#featureapiorders)
- [feature/api/auth](#featureapiauth)
- [feature/frontend/core-architecture](#featurefrontendcore-architecture)
- [feature/frontend/categories](#featurefrontendcategories)
- [feature/frontend/products](#featurefrontendproducts)
- [feature/frontend/customers](#featurefrontendcustomers)
- [feature/frontend/orders](#featurefrontendorders)
- [feature/frontend/auth](#featurefrontendauth)
- [Order of work](#order-of-work)
- [Code conventions](#code-conventions)
- [How to follow this tutorial](#how-to-follow-this-tutorial)

## Tech stack

### Backend

| Component | Choice | Version |
|---|---|---|
| Runtime | Node.js | 20+ (LTS) |
| Framework | Express | ^5.1.0 |
| Database | MySQL | 8 |
| ORM | Sequelize | ^6.37.7 |
| Migrations and Seeders | Sequelize CLI | ^6.6.3 |
| Validation | express-validator | ^7.2.1 |
| Authentication | Passport + passport-local + passport-jwt | ^0.7.0 / ^1.0.0 / ^4.0.1 |
| JWT | jsonwebtoken | ^9.0.2 |
| Password hashing | bcryptjs | ^3.0.2 |
| Environment | dotenv | ^16.5.0 |
| Tests | Jest + Supertest | ^29.7.0 / ^7.1.0 |
| Dev server | nodemon | ^3.1.10 |
| Package manager | yarn | 1.22.22 |

### Frontend

| Component | Choice | Version |
|---|---|---|
| Framework | React | ^19.0.0 |
| Bundler | Vite | ^6.3.0 |
| Routing | React Router | ^7.6.0 |
| HTTP Client | Axios | ^1.9.0 |
| Forms | Formik + Yup | ^2.4.6 / ^1.6.1 |
| UI Components | React Bootstrap + Bootstrap | ^2.10.9 / ^5.3.3 |
| Tests | React Testing Library + Cypress | ^16.3.0 / ^14.0.0 |

## Data model

### Business data

```
categories (id, category_name)
    | 1
    |
    | N
products (id, category_id, product_name, unit_price)
    | 1
    |
    | N
orders (id, customer_id, product_id, qty, total)
    | N
    |
    | 1
customers (id, first_name, last_name, tel, email, address)
```

### Auth data (RBAC + token lifecycle)

```
users --< role_user >-- roles --< role_permission >-- permissions
  |
  |--< blacklisted_tokens
  |--< activation_tokens
  |--< password_reset_tokens
```

### Column details

**users**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | |
| enabled | BOOLEAN | NOT NULL |
| account_locked | BOOLEAN | NOT NULL |

**roles**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| role_name | VARCHAR(50) | NOT NULL, UNIQUE |

**permissions**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| resource | VARCHAR(50) | NOT NULL |
| action | VARCHAR(50) | NOT NULL |

**role_user** (M:M users and roles)
| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | FK -> users.id, NOT NULL |
| role_id | BIGINT | FK -> roles.id, NOT NULL |

**role_permission** (M:M roles and permissions)
| Column | Type | Constraints |
|---|---|---|
| role_id | BIGINT | FK -> roles.id, NOT NULL |
| permission_id | BIGINT | FK -> permissions.id, NOT NULL |

**blacklisted_tokens**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK -> users.id |
| token | VARCHAR(768) | NOT NULL |
| jti | VARCHAR(255) | UNIQUE |
| blacklisted_at | DATETIME | |
| created_at | DATETIME | NOT NULL |
| expires_at | DATETIME | |
| validated_at | DATETIME | |

**activation_tokens**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK -> users.id |
| token | VARCHAR(255) | |
| created_at | DATETIME | NOT NULL |
| expires_at | DATETIME | |
| validated_at | DATETIME | |

**password_reset_tokens**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK -> users.id |
| token | VARCHAR(255) | NOT NULL |
| type | VARCHAR(255) | NOT NULL |
| expiry_date | DATETIME | NOT NULL |

**categories**
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PK, auto-increment |
| category_name | VARCHAR(255) | NOT NULL |

**products**
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PK, auto-increment |
| category_id | INTEGER | FK -> categories.id, NOT NULL |
| product_name | VARCHAR(255) | NOT NULL |
| unit_price | FLOAT | NOT NULL, > 0 |

**customers**
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PK, auto-increment |
| first_name | VARCHAR(255) | NOT NULL |
| last_name | VARCHAR(255) | NOT NULL |
| tel | VARCHAR(50) | |
| email | VARCHAR(255) | valid email format |
| address | VARCHAR(255) | |

**orders**
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PK, auto-increment |
| customer_id | INTEGER | FK -> customers.id, NOT NULL |
| product_id | INTEGER | FK -> products.id, NOT NULL |
| qty | FLOAT | NOT NULL, > 0 |
| total | FLOAT | NOT NULL, computed as qty x unit_price |

## Branching strategy

| Branch | Role |
|---|---|
| `master` | Stable, production-ready code. No direct commits. Merges from `develop` only. |
| `develop` | Integration branch. All `feature/*` branches are merged here. |
| `feature/api/core-architecture` | Technical foundation: `src/` structure, config, dependencies, shared utilities, error middleware. |
| `feature/api/categories` | `Category` module: model, repository, service, controller, routes, validation, tests. |
| `feature/api/products` | `Product` module with FK relation to `Category`. |
| `feature/api/customers` | `Customer` module. |
| `feature/api/orders` | `Order` module with business logic (computed `total`). |
| `feature/api/auth` | JWT authentication: register, activate, login, logout (blacklist), password reset, RBAC. |
| `feature/frontend/core-architecture` | React base setup: Vite, routing, Axios instance, Navbar. |
| `feature/frontend/categories` | `categories` feature: service, hook, components, page. |
| `feature/frontend/products` | `products` feature. |
| `feature/frontend/customers` | `customers` feature. |
| `feature/frontend/orders` | `orders` feature with automatic total calculation. |
| `feature/frontend/auth` | Login and Register pages, protected routes, JWT storage and attachment. |

Each feature is developed on its own branch, then merged into `develop` via a documented pull request.

## Project structure

```
mern_tutorial/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── database.js
│   │   ├── database/
│   │   │   ├── config/
│   │   │   │   └── config.js         <- sequelize-cli config (reads .env)
│   │   │   ├── models/
│   │   │   │   ├── index.js          <- sequelize-cli auto-loader
│   │   │   │   ├── user.js
│   │   │   │   ├── role.js
│   │   │   │   ├── permission.js
│   │   │   │   ├── blacklistedToken.js
│   │   │   │   ├── activationToken.js
│   │   │   │   ├── passwordResetToken.js
│   │   │   │   ├── category.js
│   │   │   │   ├── product.js
│   │   │   │   ├── customer.js
│   │   │   │   └── order.js
│   │   │   ├── repositories/
│   │   │   │   ├── user.repository.js
│   │   │   │   ├── token.repository.js
│   │   │   │   ├── category.repository.js
│   │   │   │   ├── product.repository.js
│   │   │   │   ├── customer.repository.js
│   │   │   │   └── order.repository.js
│   │   │   ├── migrations/
│   │   │   └── seeders/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.validation.js
│   │   │   ├── categories/
│   │   │   │   ├── category.routes.js
│   │   │   │   ├── category.controller.js
│   │   │   │   ├── category.service.js
│   │   │   │   └── category.validation.js
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── orders/
│   │   ├── middlewares/
│   │   │   ├── error.middleware.js
│   │   │   └── auth.middleware.js    <- JWT verification, protects private routes
│   │   └── shared/
│   │       └── utils/
│   │           ├── apiResponse.js
│   │           └── catchAsync.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .sequelizerc
│   ├── .env.example
│   ├── yarn.lock
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── router.jsx
│   │   │   └── providers.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── services/authApi.js
│   │   │   │   ├── hooks/useAuth.js
│   │   │   │   ├── components/LoginForm.jsx
│   │   │   │   ├── components/RegisterForm.jsx
│   │   │   │   ├── pages/LoginPage.jsx
│   │   │   │   ├── pages/RegisterPage.jsx
│   │   │   │   └── index.js
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── orders/
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── Navbar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── lib/
│   │   │   └── axios.js
│   │   └── index.js
│   ├── yarn.lock
│   └── package.json
└── README.md
```

## Standard response format

Every API response is wrapped in a consistent envelope:

```json
{ "success": true,  "message": "Category created successfully", "data": { ... } }
{ "success": false, "message": "Category not found" }
```

Implemented in `src/shared/utils/apiResponse.js`:

```js
apiResponse.success(res, 'OK', data, 200);
apiResponse.error(res, 'Not found', 404);
```

## feature/api/core-architecture

Technical foundation shared by the entire backend. Contains everything that will be reused by every module.

### Tasks

- [x] Update `backend/package.json`: Express 5, Sequelize 6, mysql2 3, dotenv, nodemon, jest, supertest
- [x] Add auth dependencies: passport, passport-local, passport-jwt, jsonwebtoken, bcryptjs
- [x] Create `backend/.env.example`
- [x] Create `backend/.sequelizerc`
- [x] Create `src/config/env.js`
- [x] Create `src/config/database.js`
- [x] Create `src/database/config/config.js`
- [x] Create `src/database/models/index.js`
- [x] Create `src/database/repositories/` (filled branch by branch)
- [x] Create `src/database/migrations/` and `src/database/seeders/` (empty folders)
- [x] Create `src/shared/utils/apiResponse.js`
- [x] Create `src/shared/utils/catchAsync.js`
- [x] Create `src/middlewares/error.middleware.js`
- [x] Create `src/middlewares/auth.middleware.js` (skeleton, implemented in feature/api/auth)
- [x] Create `src/modules/auth/` (skeleton, implemented in feature/api/auth)
- [x] Create `src/app.js`
- [x] Create `src/server.js`
- [x] Remove old express-generator scaffold files
- [x] Write unit tests for `apiResponse`, `catchAsync`, `error.middleware`

## feature/api/categories

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get a category by id |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Tasks

- [ ] `src/database/models/category.js`
- [ ] Migration `create-categories`
- [ ] Categories seeder
- [ ] `src/database/repositories/category.repository.js`
- [ ] `src/modules/categories/category.validation.js`
- [ ] `src/modules/categories/category.service.js`
- [ ] `src/modules/categories/category.controller.js`
- [ ] `src/modules/categories/category.routes.js`
- [ ] Mount router in `src/app.js`
- [ ] Unit tests for the service (Jest + mocks)
- [ ] Integration tests for the routes (Supertest)

## feature/api/products

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/products` | List all products (with category) |
| GET | `/api/products/:id` | Get a product by id |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Tasks

- [ ] `src/database/models/product.js` with `belongsTo Category` association
- [ ] Migration and seeder for products
- [ ] `src/database/repositories/product.repository.js` (JOIN with Category)
- [ ] `src/modules/products/product.validation.js`
- [ ] `src/modules/products/product.service.js`
- [ ] `src/modules/products/product.controller.js`
- [ ] `src/modules/products/product.routes.js`
- [ ] Mount router in `src/app.js`
- [ ] Unit tests and integration tests

## feature/api/customers

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/:id` | Get a customer by id |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |

### Tasks

- [ ] `src/database/models/customer.js`
- [ ] Migration and seeder for customers
- [ ] `src/database/repositories/customer.repository.js`
- [ ] `src/modules/customers/customer.validation.js`
- [ ] `src/modules/customers/customer.service.js`
- [ ] `src/modules/customers/customer.controller.js`
- [ ] `src/modules/customers/customer.routes.js`
- [ ] Mount router in `src/app.js`
- [ ] Unit tests and integration tests

## feature/api/orders

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/orders` | List all orders (with customer and product) |
| GET | `/api/orders/:id` | Get an order by id |
| POST | `/api/orders` | Create an order (total computed automatically) |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |

### Tasks

- [ ] `src/database/models/order.js` with `belongsTo Customer` and `belongsTo Product` associations
- [ ] Migration and seeder for orders
- [ ] `src/database/repositories/order.repository.js` (JOIN with Customer and Product)
- [ ] `src/modules/orders/order.validation.js`
- [ ] `src/modules/orders/order.service.js` with business rule: `total = qty x unit_price`
- [ ] `src/modules/orders/order.controller.js`
- [ ] `src/modules/orders/order.routes.js`
- [ ] Mount router in `src/app.js`
- [ ] Unit tests (total calculation) and integration tests

## feature/api/auth

JWT authentication with RBAC (Role-Based Access Control), full token lifecycle management (blacklist on logout), account activation, and password reset. Based on the EER diagram `EER (2).png`.

### Endpoints

| Method | URL | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account (enabled=false, sends activation token) |
| GET | `/api/auth/activate/:token` | No | Activate the account (sets enabled=true) |
| POST | `/api/auth/login` | No | Authenticate and receive a JWT |
| POST | `/api/auth/logout` | Yes | Blacklist the current JWT |
| GET | `/api/auth/me` | Yes | Return the authenticated user with roles |
| POST | `/api/auth/forgot-password` | No | Send a password reset token |
| POST | `/api/auth/reset-password/:token` | No | Set a new password |

### JWT flow with blacklist

```
Client -> POST /api/auth/login -> { token: "eyJ..." }
Client -> GET /api/categories (Authorization: Bearer eyJ...) -> 200 OK
Client -> POST /api/auth/logout (Authorization: Bearer eyJ...) -> token blacklisted
Client -> GET /api/categories (Authorization: Bearer eyJ...) -> 401 Unauthorized
```

### RBAC

```
Admin user  -> ADMIN role  -> permissions [categories:write, products:write, ...]
Regular user -> USER role  -> permissions [categories:read, products:read, ...]
```

### Tasks

**Models and migrations**
- [ ] `src/database/models/user.js` with first_name, last_name, email, password, enabled, account_locked
- [ ] `src/database/models/role.js`
- [ ] `src/database/models/permission.js`
- [ ] `src/database/models/blacklistedToken.js`
- [ ] `src/database/models/activationToken.js`
- [ ] `src/database/models/passwordResetToken.js`
- [ ] Associations: User belongsToMany Role via role_user, Role belongsToMany Permission via role_permission
- [ ] Migrations for all auth tables
- [ ] Seeder: ADMIN and USER roles, CRUD permissions per resource

**Repositories**
- [ ] `src/database/repositories/user.repository.js`
- [ ] `src/database/repositories/token.repository.js` (blacklist + activation + reset)

**Auth module**
- [ ] `src/modules/auth/auth.validation.js`
- [ ] `src/modules/auth/auth.service.js` with bcrypt, jwt.sign, blacklist check, RBAC check
- [ ] `src/modules/auth/auth.controller.js`
- [ ] `src/modules/auth/auth.routes.js`

**Infrastructure**
- [ ] Implement `src/middlewares/auth.middleware.js` with passport-jwt strategy and blacklist check
- [ ] `src/config/passport.js` to configure the passport-jwt strategy
- [ ] Mount router in `src/app.js`

**Tests**
- [ ] Unit tests for service (bcrypt, jwt, RBAC)
- [ ] Integration tests: register / activate / login / logout / me / reset

## feature/frontend/core-architecture

React base setup with Vite. Everything the feature branches will need: routing, configured Axios instance, layout, and protected route component.

### Tasks

- [ ] Initialize Vite + React 19
- [ ] Install Bootstrap, React Router, Axios, Formik, Yup, React Bootstrap
- [ ] Create `src/lib/axios.js` with configured baseURL and JWT interceptor
- [ ] Create `src/app/App.jsx`, `src/app/router.jsx`, `src/app/providers.jsx`
- [ ] Create `src/shared/components/Navbar.jsx`
- [ ] Create `src/shared/components/ProtectedRoute.jsx` (skeleton)
- [ ] Update `src/index.js`

## feature/frontend/categories

### Tasks

- [ ] `src/features/categories/services/categoryApi.js`
- [ ] `src/features/categories/hooks/useCategories.js`
- [ ] `src/features/categories/components/CategoryList.jsx`
- [ ] `src/features/categories/components/CategoryForm.jsx` with Formik + Yup
- [ ] `src/features/categories/pages/CategoriesPage.jsx`
- [ ] `src/features/categories/index.js`
- [ ] Add `/categories` route in `router.jsx`
- [ ] Unit tests for hook and components

## feature/frontend/products

### Tasks

- [ ] Service, hook, components, and page for `products`
- [ ] `ProductForm` with category select (cross-feature imports allowed in Form components)
- [ ] Add `/products` route in `router.jsx`
- [ ] Tests

## feature/frontend/customers

### Tasks

- [ ] Service, hook, components, and page for `customers`
- [ ] Add `/customers` route in `router.jsx`
- [ ] Tests

## feature/frontend/orders

### Tasks

- [ ] Service, hook, components, and page for `orders`
- [ ] `OrderForm` with customer select, product select, and automatic `total = qty x unit_price` calculation
- [ ] Add `/orders` route in `router.jsx`
- [ ] Cypress e2e tests

## feature/frontend/auth

### Tasks

- [ ] `src/features/auth/services/authApi.js` with register / login / me calls
- [ ] `src/features/auth/hooks/useAuth.js` with token management (localStorage) and user state
- [ ] `src/features/auth/components/LoginForm.jsx` with Formik + Yup
- [ ] `src/features/auth/components/RegisterForm.jsx`
- [ ] `src/features/auth/pages/LoginPage.jsx`
- [ ] `src/features/auth/pages/RegisterPage.jsx`
- [ ] `src/features/auth/index.js`
- [ ] Implement `src/shared/components/ProtectedRoute.jsx` to redirect unauthenticated users
- [ ] Update the Axios interceptor in `src/lib/axios.js` to attach the JWT header
- [ ] Protect private routes in `router.jsx`
- [ ] Unit tests for hook and components

## Order of work

1. `feature/api/core-architecture` -> merge `develop`
2. `feature/api/categories` -> merge `develop`
3. `feature/api/products` -> merge `develop`
4. `feature/api/customers` -> merge `develop`
5. `feature/api/orders` -> merge `develop`
6. `feature/api/auth` -> merge `develop`
7. `feature/frontend/core-architecture` -> merge `develop`
8. `feature/frontend/categories` -> merge `develop`
9. `feature/frontend/products` -> merge `develop`
10. `feature/frontend/customers` -> merge `develop`
11. `feature/frontend/orders` -> merge `develop`
12. `feature/frontend/auth` -> merge `develop`
13. `develop` -> `master` once everything is validated

## Code conventions

### Backend

- Request flow: `Route -> auth.middleware (optional) -> validation -> Controller -> Service -> Repository -> DB`
- The **repository** is the only layer allowed to access the database
- The **service** holds pure business logic with no `req` or `res` references
- The **controller** only handles `req`/`res` and delegates to the service
- Always use `catchAsync` in controllers (no manual `try/catch`)
- All responses go through `success()` or `error()` from `apiResponse.js`
- Atomic commits: one commit per file created or modified, using conventional format

### Frontend

- One feature = one self-contained folder in `src/features/`
- The hook is the only layer allowed to call the API service
- Components receive data and callbacks as props, with no direct API calls
- Cross-feature imports are allowed only in `Form` components (e.g. category select inside `ProductForm`)

## How to follow this tutorial

1. Clone the repository and switch to `develop`
2. Start MySQL locally and create the `mern_db` database
3. Copy `backend/.env.example` to `backend/.env` and fill in your credentials
4. Check out `feature/api/core-architecture` and follow its task checklist
5. Continue branch by branch in the order defined above
6. Start the backend: `cd backend && yarn dev` -> `http://localhost:3001`
7. Start the frontend: `cd frontend && yarn dev` -> `http://localhost:5173`
