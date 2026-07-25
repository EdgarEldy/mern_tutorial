# MERN Tutorial

A complete, hands-on walkthrough of building a full-stack CRUD application with **Express 5 / Node.js** (backend) and **React 19 / Vite** (frontend), organized into Git branches that progressively cover the key concepts of the stack. Uses **MySQL 8** and **Sequelize ORM** instead of MongoDB, and completed with **JWT + Passport.js** authentication.

The data model follows: `categories` -> `products` -> `orders` <- `customers`, secured by a full JWT authentication system with RBAC.

This document is the **complete specification** of the project. It is meant to be followed step by step, branch by branch.

Repository: https://github.com/EdgarEldy/mern_tutorial

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Branching Strategy](#branching-strategy)
- [Project Structure](#project-structure)
- [Standard Response Format](#standard-response-format)
- [Git Commit Convention](#git-commit-convention)
- [feature/api/core-architecture](#featureapicore-architecture)
- [feature/api/categories](#featureapicategories)
- [feature/api/products](#featureapiproducts)
- [feature/api/customers](#featureapicustomers)
- [feature/api/orders](#featureapiorders)
- [feature/api/auth](#featureapiauth)
- [GraphQL](#graphql)
- [feature/frontend/core-architecture](#featurefrontendcore-architecture)
- [feature/frontend/categories](#featurefrontendcategories)
- [feature/frontend/products](#featurefrontendproducts)
- [feature/frontend/customers](#featurefrontendcustomers)
- [feature/frontend/orders](#featurefrontendorders)
- [feature/frontend/auth](#featurefrontendauth)
- [Order of Work](#order-of-work)
- [Code Conventions](#code-conventions)
- [Concepts Covered](#concepts-covered)
- [How to Follow This Tutorial](#how-to-follow-this-tutorial)

---

## Tech Stack

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
| GraphQL | Apollo Server 5 + @as-integrations/express5 | ^5.0.0 / ^1.1.2 |
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
| UI Theme | SB Admin 2 (Bootstrap 4) | static |
| Forms | Formik + Yup | ^2.4.6 / ^1.6.1 |
| Tests | React Testing Library + Cypress | ^16.3.0 / ^14.0.0 |

---

## Data Model

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
orders (id, customer_id, product_id, quantity, total)
    | N
    |
    | 1
customers (id, first_name, last_name, telephone, email, address)
```

### Auth data (RBAC + token lifecycle)

```
users --< role_user >-- roles --< role_permission >-- permissions
  |
  |--< blacklisted_tokens
  |--< activation_tokens
  |--< password_reset_tokens
```

### Column Details

**categories**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| category_name | VARCHAR(255) | NOT NULL |

**products**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| category_id | BIGINT | FK -> categories.id, NOT NULL |
| product_name | VARCHAR(255) | NOT NULL |
| unit_price | FLOAT | NOT NULL |

**customers**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| first_name | VARCHAR(255) | |
| last_name | VARCHAR(255) | |
| telephone | VARCHAR(50) | |
| email | VARCHAR(255) | |
| address | VARCHAR(255) | |

**orders**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| customer_id | BIGINT | FK -> customers.id, NOT NULL |
| product_id | BIGINT | FK -> products.id, NOT NULL |
| quantity | INTEGER | NOT NULL |
| total | DOUBLE | NOT NULL, computed = quantity x unit_price |

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

**role_user** (M:M join table)
| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | FK -> users.id, NOT NULL |
| role_id | BIGINT | FK -> roles.id, NOT NULL |

**role_permission** (M:M join table)
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

---

## Branching Strategy

| Branch | Role |
|---|---|
| `master` | Stable, production-ready code. No direct commits. Merges from `develop` only. |
| `develop` | Integration branch. All `feature/*` branches are merged here via PR before going to `master`. |
| `feature/api/core-architecture` | Technical foundation: `src/` structure, config, dependencies, shared utilities, error middleware. |
| `feature/api/categories` | `Category` module: model, repository, service, controller, routes, validation, tests. |
| `feature/api/products` | `Product` module with FK relation to `Category`. |
| `feature/api/customers` | `Customer` module. |
| `feature/api/orders` | `Order` module with business logic (computed `total`). |
| `feature/api/auth` | JWT authentication: register, activate, login, logout (blacklist), password reset, RBAC. |
| `feature/frontend/core-architecture` | React base setup: Vite, routing, Axios instance, layout shell. |
| `feature/frontend/categories` | `categories` feature: service, hook, components, pages, public API. |
| `feature/frontend/products` | `products` feature with cross-feature `CategorySelect`. |
| `feature/frontend/customers` | `customers` feature. |
| `feature/frontend/orders` | `orders` feature with automatic total calculation and cross-feature selects. |
| `feature/frontend/auth` | Login and Register pages, protected routes, JWT storage and attachment. |

Each feature branch ends with a Pull Request to `develop`. Each PR must include atomic commits (one per file).

---

## Project Structure

```
mern_tutorial/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── env.js                    <- single source of truth for process.env reads
│   │   │   └── database.js               <- runtime Sequelize instance
│   │   ├── database/
│   │   │   ├── config/
│   │   │   │   └── config.js             <- sequelize-cli config (reads .env)
│   │   │   ├── models/
│   │   │   │   ├── index.js              <- sequelize-cli auto-loader, runs associate()
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
│   │   │   │   ├── product.routes.js
│   │   │   │   ├── product.controller.js
│   │   │   │   ├── product.service.js
│   │   │   │   └── product.validation.js
│   │   │   ├── customers/
│   │   │   │   ├── customer.routes.js
│   │   │   │   ├── customer.controller.js
│   │   │   │   ├── customer.service.js
│   │   │   │   └── customer.validation.js
│   │   │   └── orders/
│   │   │       ├── order.routes.js
│   │   │       ├── order.controller.js
│   │   │       ├── order.service.js
│   │   │       └── order.validation.js
│   │   ├── graphql/
│   │   │   ├── schema.js                 <- assembles typeDefs + resolvers arrays for ApolloServer
│   │   │   ├── typeDefs/
│   │   │   │   ├── base.typeDefs.js      <- root Query and Mutation types (_health, _empty)
│   │   │   │   └── order.typeDefs.js     <- Order, Customer, Product, Category + CRUD extensions
│   │   │   └── resolvers/
│   │   │       ├── base.resolvers.js     <- _health resolver
│   │   │       └── order.resolvers.js    <- delegates to order.service (not repository directly)
│   │   ├── middlewares/
│   │   │   ├── error.middleware.js       <- global error handler, registered last in app.js
│   │   │   └── auth.middleware.js        <- JWT verification, protects private routes
│   │   └── shared/
│   │       └── utils/
│   │           ├── apiResponse.js        <- success() / error() response envelope
│   │           └── catchAsync.js         <- wraps async controllers, forwards to next(err)
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .sequelizerc
│   ├── .env.example
│   ├── yarn.lock
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── css/                          <- Bootstrap 4, SB Admin 2, FontAwesome (static)
│   │   └── js/                           <- jQuery, Bootstrap JS, DataTables (static)
│   ├── src/
│   │   ├── main.jsx                      <- React 19 createRoot entry point
│   │   ├── App.jsx                       <- BrowserRouter + Routes
│   │   ├── lib/
│   │   │   └── axios.js                  <- shared Axios instance (baseURL /api/v1, JWT interceptor)
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   └── DefaultLayout.jsx     <- sidebar + topbar + <Outlet />
│   │   │   └── partials/
│   │   │       ├── SideBar.jsx
│   │   │       ├── TopBar.jsx
│   │   │       └── Footer.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   └── features/
│   │       ├── categories/
│   │       │   ├── services/
│   │       │   │   └── category.service.js
│   │       │   ├── hooks/
│   │       │   │   └── useCategories.js
│   │       │   ├── components/
│   │       │   │   ├── CategoryTable.jsx
│   │       │   │   ├── CategoryForm.jsx
│   │       │   │   └── CategorySelect.jsx  <- exported for ProductForm
│   │       │   ├── pages/
│   │       │   │   ├── CategoryListPage.jsx
│   │       │   │   └── CategoryFormPage.jsx
│   │       │   └── index.js
│   │       ├── products/
│   │       │   ├── services/
│   │       │   │   └── product.service.js
│   │       │   ├── hooks/
│   │       │   │   └── useProducts.js
│   │       │   ├── components/
│   │       │   │   ├── ProductTable.jsx
│   │       │   │   ├── ProductForm.jsx     <- imports CategorySelect from categories
│   │       │   │   └── ProductSelect.jsx   <- exported for OrderForm
│   │       │   ├── pages/
│   │       │   │   ├── ProductListPage.jsx
│   │       │   │   └── ProductFormPage.jsx
│   │       │   └── index.js
│   │       ├── customers/
│   │       │   ├── services/
│   │       │   │   └── customer.service.js
│   │       │   ├── hooks/
│   │       │   │   └── useCustomers.js
│   │       │   ├── components/
│   │       │   │   ├── CustomerTable.jsx
│   │       │   │   ├── CustomerForm.jsx
│   │       │   │   └── CustomerSelect.jsx  <- exported for OrderForm
│   │       │   ├── pages/
│   │       │   │   ├── CustomerListPage.jsx
│   │       │   │   └── CustomerFormPage.jsx
│   │       │   └── index.js
│   │       └── orders/
│   │           ├── services/
│   │           │   └── order.service.js
│   │           ├── hooks/
│   │           │   └── useOrders.js
│   │           ├── components/
│   │           │   ├── OrderTable.jsx
│   │           │   └── OrderForm.jsx       <- imports CustomerSelect + ProductSelect
│   │           ├── pages/
│   │           │   ├── OrderListPage.jsx
│   │           │   └── OrderFormPage.jsx
│   │           └── index.js
│   ├── index.html
│   ├── vite.config.js
│   ├── yarn.lock
│   └── package.json
└── README.md
```

---

## Standard Response Format

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

HTTP status codes: `200` for reads/updates, `201` for creates, `404` for not found, `422` for validation errors.

---

## Git Commit Convention

All commits follow **Conventional Commits** with an atomic rule.

### Format

```
<type>(<scope>): <short summary>

<body: explain the WHY, the tradeoff, and the educational context>
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature or file |
| `fix` | Bug fix |
| `refactor` | Code change that is neither a bug fix nor a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Tooling, config, CI, deps |

### Atomic Commit Rule

> **One commit per file added or modified.** Never group unrelated files in a single commit.

**Good:**
```
feat(categories): add category.service.js - business logic layer

Delegates all DB access to the repository so the controller stays
free of query logic. Throws errors as plain objects; the global
error middleware maps them to HTTP responses.
```

**Bad:**
```
feat: add categories module files
```

---

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
- [x] Create `src/shared/utils/apiResponse.js`
- [x] Create `src/shared/utils/catchAsync.js`
- [x] Create `src/middlewares/error.middleware.js`
- [x] Create `src/middlewares/auth.middleware.js` (skeleton, implemented in feature/api/auth)
- [x] Create `src/app.js`
- [x] Create `src/server.js`
- [x] Write unit tests for `apiResponse`, `catchAsync`, `error.middleware`
- [x] Install `@apollo/server@^5.0.0`, `@as-integrations/express5`, `graphql@^16.9.0`
- [x] Create `src/graphql/typeDefs/base.typeDefs.js` - root Query (`_health`) and Mutation (`_empty`)
- [x] Create `src/graphql/resolvers/base.resolvers.js` - `_health` returns `"OK"`
- [x] Create `src/graphql/schema.js` - exports `{ typeDefs, resolvers }` arrays for ApolloServer
- [x] Update `src/server.js` - start ApolloServer before `httpServer.listen`, mount at `/api/v1/graphql`

---

## feature/api/categories

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/categories/:id` | Get a category by id |
| POST | `/api/v1/categories` | Create a category |
| PUT | `/api/v1/categories/:id` | Update a category |
| DELETE | `/api/v1/categories/:id` | Delete a category |

### Tasks

- [x] `src/database/models/category.js`
- [x] Migration `create-categories`
- [x] Categories seeder
- [x] `src/database/repositories/category.repository.js`
- [x] `src/modules/categories/category.validation.js`
- [x] `src/modules/categories/category.service.js`
- [x] `src/modules/categories/category.controller.js`
- [x] `src/modules/categories/category.routes.js`
- [x] Mount router in `src/app.js`
- [x] Unit tests for the service (Jest + mocks)
- [x] Integration tests for the routes (Supertest)

---

## feature/api/products

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/products` | List all products (with nested category) |
| GET | `/api/v1/products/:id` | Get a product by id |
| POST | `/api/v1/products` | Create a product |
| PUT | `/api/v1/products/:id` | Update a product |
| DELETE | `/api/v1/products/:id` | Delete a product |

### Tasks

- [x] `src/database/models/product.js` with `belongsTo Category` association
- [x] Migration and seeder for products
- [x] `src/database/repositories/product.repository.js` (JOIN with Category)
- [x] `src/modules/products/product.validation.js`
- [x] `src/modules/products/product.service.js`
- [x] `src/modules/products/product.controller.js`
- [x] `src/modules/products/product.routes.js`
- [x] Mount router in `src/app.js`
- [x] Unit tests and integration tests

---

## feature/api/customers

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/customers` | List all customers |
| GET | `/api/v1/customers/:id` | Get a customer by id |
| POST | `/api/v1/customers` | Create a customer |
| PUT | `/api/v1/customers/:id` | Update a customer |
| DELETE | `/api/v1/customers/:id` | Delete a customer |

### Tasks

- [x] `src/database/models/customer.js`
- [x] Migration and seeder for customers
- [x] `src/database/repositories/customer.repository.js`
- [x] `src/modules/customers/customer.validation.js`
- [x] `src/modules/customers/customer.service.js`
- [x] `src/modules/customers/customer.controller.js`
- [x] `src/modules/customers/customer.routes.js`
- [x] Mount router in `src/app.js`
- [x] Unit tests and integration tests

---

## feature/api/orders

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/orders` | List all orders (with customer and product) |
| GET | `/api/v1/orders/:id` | Get an order by id |
| POST | `/api/v1/orders` | Create an order (total computed automatically) |
| PUT | `/api/v1/orders/:id` | Update an order |
| DELETE | `/api/v1/orders/:id` | Delete an order |

### Tasks

- [x] `src/database/models/order.js` with `belongsTo Customer` and `belongsTo Product` associations
- [x] Migration and seeder for orders
- [x] `src/database/repositories/order.repository.js` (JOIN with Customer and Product)
- [x] `src/modules/orders/order.validation.js`
- [x] `src/modules/orders/order.service.js` with business rule: `total = quantity x unit_price`
- [x] `src/modules/orders/order.controller.js`
- [x] `src/modules/orders/order.routes.js`
- [x] Mount router in `src/app.js`
- [x] Unit tests (total calculation) and integration tests
- [x] `src/graphql/typeDefs/order.typeDefs.js` - Order, Customer, Product, Category types + CRUD operations
- [x] `src/graphql/resolvers/order.resolvers.js` - delegates to order.service (total recalculated on mutation)
- [x] Update `src/graphql/schema.js` to include order typeDefs and resolvers

### GraphQL Operations (Orders)

All operations are available at `POST /api/v1/graphql`.

#### Queries

```graphql
query {
  orders {
    id
    quantity
    total
    customer { first_name last_name email }
    product  { product_name unit_price category { category_name } }
  }
}

query {
  order(id: "1") {
    id quantity total
    customer { first_name }
    product  { product_name unit_price }
  }
}
```

#### Mutations

```graphql
mutation {
  createOrder(input: { customer_id: "1", product_id: "1", quantity: 2 }) {
    id total
  }
}

mutation {
  updateOrder(id: "1", input: { quantity: 5 }) {
    id total
  }
}

mutation {
  deleteOrder(id: "1")
}
```

---

## feature/api/auth

JWT authentication with RBAC, full token lifecycle management (blacklist on logout), account activation, and password reset.

### Endpoints

| Method | URL | Auth required | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Create an account (enabled=false, sends activation token) |
| GET | `/api/v1/auth/activate/:token` | No | Activate the account (sets enabled=true) |
| POST | `/api/v1/auth/login` | No | Authenticate and receive a JWT |
| POST | `/api/v1/auth/logout` | Yes | Blacklist the current JWT |
| GET | `/api/v1/auth/me` | Yes | Return the authenticated user with roles |
| POST | `/api/v1/auth/forgot-password` | No | Send a password reset token |
| POST | `/api/v1/auth/reset-password/:token` | No | Set a new password |

### JWT flow with blacklist

```
Client -> POST /api/v1/auth/login   -> { token: "eyJ..." }
Client -> GET  /api/v1/categories   (Authorization: Bearer eyJ...) -> 200 OK
Client -> POST /api/v1/auth/logout  (Authorization: Bearer eyJ...) -> token blacklisted
Client -> GET  /api/v1/categories   (Authorization: Bearer eyJ...) -> 401 Unauthorized
```

### RBAC

```
Admin user   -> ADMIN role -> permissions [categories:write, products:write, ...]
Regular user -> USER role  -> permissions [categories:read, products:read, ...]
```

### Tasks

**Models and migrations**
- [x] `src/database/models/user.js`
- [x] `src/database/models/role.js`
- [x] `src/database/models/permission.js`
- [x] `src/database/models/blacklistedToken.js`
- [x] `src/database/models/activationToken.js`
- [x] `src/database/models/passwordResetToken.js`
- [x] Associations: User belongsToMany Role, Role belongsToMany Permission
- [x] Migrations for all auth tables
- [x] Seeder: ADMIN and USER roles, CRUD permissions per resource

**Repositories**
- [x] `src/database/repositories/user.repository.js`
- [x] `src/database/repositories/token.repository.js`

**Auth module**
- [x] `src/modules/auth/auth.validation.js`
- [x] `src/modules/auth/auth.service.js`
- [x] `src/modules/auth/auth.controller.js`
- [x] `src/modules/auth/auth.routes.js`

**Infrastructure**
- [x] Implement `src/middlewares/auth.middleware.js` with passport-jwt strategy and blacklist check
- [x] `src/config/passport.js`
- [x] Mount router in `src/app.js`

**Tests**
- [ ] Unit tests for service (bcrypt, jwt, RBAC)
- [ ] Integration tests: register / activate / login / logout / me / reset

---

## GraphQL

Apollo Server 5 is mounted at `POST /api/v1/graphql`. In development mode, visiting the endpoint in a browser opens the **Apollo Sandbox** - an interactive explorer to write and run operations without any extra tool.

### Architecture

The GraphQL layer reuses the existing service and repository modules. No separate data access code was written.

```
ApolloServer (server.js)
  schema.js  <-- assembles typeDefs[] and resolvers[]
    base.typeDefs.js    "type Query { _health }"  "type Mutation { _empty }"
    base.resolvers.js   _health: () => "OK"
    order.typeDefs.js   Order, Customer, Product, Category + extend Query/Mutation
    order.resolvers.js  calls order.service (same total-calculation logic as REST)
```

### Startup Sequence

`server.js` performs these steps in order:

1. Sequelize authenticates the DB connection
2. `http.createServer(app)` creates the Node HTTP server
3. `await apolloServer.start()` validates the schema, initializes plugins
4. `expressMiddleware(apolloServer)` is applied at `/api/v1/graphql`
5. `httpServer.listen(PORT)` starts accepting connections

`ApolloServerPluginDrainHttpServer` is registered so that in-flight GraphQL requests complete before the server shuts down.

### Schema Extension Pattern

Each feature module extends the root types declared in `base.typeDefs.js`:

```graphql
extend type Query {
  orders: [Order!]!
  order(id: ID!): Order
}

extend type Mutation {
  createOrder(input: CreateOrderInput!): Order!
}
```

When adding a new module (e.g., products GraphQL), push its typeDefs and resolvers into the arrays in `schema.js`:

```js
module.exports = {
  typeDefs: [baseTypeDefs, orderTypeDefs, productTypeDefs],
  resolvers: [baseResolvers, orderResolvers, productResolvers],
};
```

Apollo Server merges the arrays automatically.

### Nested Types and Sequelize

The `order.repository.js` eager-loads `customer` and `product` (with `category`) on every query. The Sequelize model instances returned expose these as direct properties, so GraphQL field resolution works without custom field resolvers:

```
order.customer.first_name   -> Customer.first_name
order.product.product_name  -> Product.product_name
order.product.unit_price    -> Product.unit_price
order.product.category.category_name -> Category.category_name
```

The field names in `order.typeDefs.js` match the Sequelize column names exactly to make this work.

### Service Reuse

`order.resolvers.js` calls `order.service` functions, not the repository directly:

```js
Mutation: {
  createOrder: (_, { input }) => orderService.createOrder(input),
  updateOrder: (_, { id, input }) => orderService.updateOrder(id, input),
}
```

This means `total = quantity * unit_price` is computed identically whether the request arrives via REST (`POST /api/v1/orders`) or GraphQL (`mutation { createOrder(...) }`).

---

## feature/frontend/core-architecture

React base setup with Vite. Everything the feature branches need: routing, configured Axios instance, layout shell, and shared partials.

### Tasks

- [x] Initialize Vite + React 19
- [x] Install React Router, Axios
- [x] Configure Vite proxy: `/api` -> `http://localhost:3001`
- [x] Create `src/lib/axios.js` with baseURL `/api/v1` and JWT Bearer interceptor
- [x] Create `src/App.jsx` with BrowserRouter + Routes
- [x] Create `src/main.jsx` with React 19 createRoot
- [x] Create `src/components/layouts/DefaultLayout.jsx`
- [x] Create `src/components/partials/SideBar.jsx`
- [x] Create `src/components/partials/TopBar.jsx`
- [x] Create `src/components/partials/Footer.jsx`
- [x] Create `src/pages/Dashboard.jsx`
- [x] Add Bootstrap 4 / SB Admin 2 static assets to `public/`

---

## feature/frontend/categories

### Routes

| Path | Component | Description |
|---|---|---|
| `/categories` | `CategoryListPage` | Table of all categories |
| `/categories/new` | `CategoryFormPage` | Create form |
| `/categories/:id/edit` | `CategoryFormPage` | Edit form (pre-filled) |

### Tasks

- [x] `src/features/categories/services/category.service.js`
- [x] `src/features/categories/hooks/useCategories.js`
- [x] `src/features/categories/components/CategoryTable.jsx`
- [x] `src/features/categories/components/CategoryForm.jsx`
- [x] `src/features/categories/components/CategorySelect.jsx` (exported for ProductForm)
- [x] `src/features/categories/pages/CategoryListPage.jsx`
- [x] `src/features/categories/pages/CategoryFormPage.jsx`
- [x] `src/features/categories/index.js`
- [x] Wire routes in `src/App.jsx`
- [x] Update SideBar.jsx Categories link

---

## feature/frontend/products

### Routes

| Path | Component | Description |
|---|---|---|
| `/products` | `ProductListPage` | Table with category column |
| `/products/new` | `ProductFormPage` | Create form |
| `/products/:id/edit` | `ProductFormPage` | Edit form (pre-filled) |

### Tasks

- [x] `src/features/products/services/product.service.js`
- [x] `src/features/products/hooks/useProducts.js`
- [x] `src/features/products/components/ProductTable.jsx`
- [x] `src/features/products/components/ProductForm.jsx` (imports `CategorySelect` from categories)
- [x] `src/features/products/components/ProductSelect.jsx` (exported for OrderForm)
- [x] `src/features/products/pages/ProductListPage.jsx`
- [x] `src/features/products/pages/ProductFormPage.jsx`
- [x] `src/features/products/index.js`
- [x] Wire routes in `src/App.jsx`
- [x] Update SideBar.jsx Products link

---

## feature/frontend/customers

### Routes

| Path | Component | Description |
|---|---|---|
| `/customers` | `CustomerListPage` | Table with all customer fields |
| `/customers/new` | `CustomerFormPage` | Create form |
| `/customers/:id/edit` | `CustomerFormPage` | Edit form (pre-filled) |

### Tasks

- [x] `src/features/customers/services/customer.service.js`
- [x] `src/features/customers/hooks/useCustomers.js`
- [x] `src/features/customers/components/CustomerTable.jsx`
- [x] `src/features/customers/components/CustomerForm.jsx`
- [x] `src/features/customers/components/CustomerSelect.jsx` (exported for OrderForm)
- [x] `src/features/customers/pages/CustomerListPage.jsx`
- [x] `src/features/customers/pages/CustomerFormPage.jsx`
- [x] `src/features/customers/index.js`
- [x] Wire routes in `src/App.jsx`
- [x] Update SideBar.jsx Customers link

---

## feature/frontend/orders

### Routes

| Path | Component | Description |
|---|---|---|
| `/orders` | `OrderListPage` | Table with customer, product, quantity, total |
| `/orders/new` | `OrderFormPage` | Create form with live total preview |
| `/orders/:id/edit` | `OrderFormPage` | Edit form (pre-filled) |

### Tasks

- [x] `src/features/orders/services/order.service.js`
- [x] `src/features/orders/hooks/useOrders.js`
- [x] `src/features/orders/components/OrderTable.jsx`
- [x] `src/features/orders/components/OrderForm.jsx` (imports `CustomerSelect` + `ProductSelect`, computes `total = quantity x unit_price` live)
- [x] `src/features/orders/pages/OrderListPage.jsx`
- [x] `src/features/orders/pages/OrderFormPage.jsx`
- [x] `src/features/orders/index.js`
- [x] Wire routes in `src/App.jsx`
- [x] Update SideBar.jsx Orders link

---

## feature/frontend/auth

### Routes

| Path | Component | Description |
|---|---|---|
| `/login` | `LoginPage` | Login form |
| `/register` | `RegisterPage` | Register form |

### Tasks

- [ ] `src/features/auth/services/auth.service.js` (register / login / me)
- [ ] `src/features/auth/hooks/useAuth.js` (token management in localStorage, user state)
- [ ] `src/features/auth/components/LoginForm.jsx`
- [ ] `src/features/auth/components/RegisterForm.jsx`
- [ ] `src/features/auth/pages/LoginPage.jsx`
- [ ] `src/features/auth/pages/RegisterPage.jsx`
- [ ] `src/features/auth/index.js`
- [ ] Create `src/components/ProtectedRoute.jsx` to redirect unauthenticated users
- [ ] Update `src/lib/axios.js` interceptor (already in place)
- [ ] Wrap private routes in `ProtectedRoute` in `src/App.jsx`

---

## Order of Work

```
1.  feature/api/core-architecture          -> PR to develop  (done)
2.  feature/api/categories                 -> PR to develop  (done)
3.  feature/api/products                   -> PR to develop  (done)
4.  feature/api/customers                  -> PR to develop  (done)
5.  feature/api/orders                     -> PR to develop  (done)
6.  feature/api/auth                       -> PR to develop  (done)
7.  feature/frontend/core-architecture     -> PR to develop  (done)
8.  feature/frontend/categories            -> PR to develop  (done)
9.  feature/frontend/products              -> PR to develop  (done)
10. feature/frontend/customers             -> PR to develop  (done)
11. feature/frontend/orders                -> PR to develop  (done)
12. feature/frontend/auth                  -> PR to develop  (TODO)
13. develop                                -> master once everything is validated
```

Each branch is created from the tip of `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<name>
```

---

## Code Conventions

### Backend

- **Request flow:** `Route -> auth.middleware (optional) -> validation -> Controller -> Service -> Repository -> DB`
- The **repository** is the only layer allowed to access the database
- The **service** holds pure business logic with no `req` or `res` references
- The **controller** only handles `req`/`res` and delegates to the service
- Always use `catchAsync` in controllers (no manual `try/catch` in controllers)
- All responses go through `success()` or `error()` from `apiResponse.js`
- Atomic commits: one commit per file created or modified

### Frontend

- **Feature layout:** each feature is self-contained in `src/features/<resource>/`
- **Services** call the API (Axios calls only, no state)
- **Hooks** call the service and manage state (fetch-on-mount, expose refetch)
- **Components** receive data and callbacks as props -- no direct API calls
- **Pages** orchestrate data (use hooks), handle delete callbacks, render components
- Cross-feature imports are allowed **only in Form components** (e.g., `CategorySelect` inside `ProductForm`)
- The public API of each feature is exposed via `index.js` only

---

## Concepts Covered

**Backend architecture**
- Layered architecture: Route -> Controller -> Service -> Repository -> DB
- Express 5 async error handling with `catchAsync`
- Sequelize ORM: models, associations, migrations, seeders
- express-validator for input validation
- Consistent API response envelope

**Authentication and security**
- Passport.js + JWT (stateless authentication)
- Token blacklisting (explicit logout via `jti`)
- Role-based access control (ADMIN, USER)
- Fine-grained permissions (resource + action)
- Account activation and password reset flows
- `bcryptjs` password hashing

**Frontend architecture**
- Feature-based folder structure (`src/features/<resource>/`)
- Separation of concerns: services / hooks / components / pages
- Custom data-fetching hooks with fetch-on-mount pattern
- Controlled forms with local state
- Cross-feature reuse via exported Select components
- Client-side routing with React Router v7
- Axios instance with base URL and JWT interceptor

**Developer workflow**
- Git branching strategy (master <- develop <- feature/*)
- Conventional Commits with atomic rule
- Pull Request workflow with task checklists

---

## How to Follow This Tutorial

```bash
# 1. Clone and set up
git clone https://github.com/EdgarEldy/mern_tutorial.git
cd mern_tutorial

# 2. Backend
cd backend
cp .env.example .env          # fill in DB credentials
yarn install
yarn db:migrate
yarn db:seed
yarn dev                       # http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
yarn install
yarn dev                       # http://localhost:5173
```

Work through branches in the [Order of Work](#order-of-work). At the end of each branch:

1. Complete every item in its Tasks list
2. Ensure all atomic commits are in place (one per file)
3. Open a Pull Request to `develop`
4. Merge to `develop`, then merge `develop` to `master`
