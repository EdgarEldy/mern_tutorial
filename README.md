# MERN Tutorial

A hands-on walkthrough of building a full-stack CRUD application with **Express 5 / Node.js** (backend) and **React 19 / Vite** (frontend), organized into Git branches that progressively cover the key concepts of the stack — adapted here with **MySQL** and **Sequelize ORM** instead of MongoDB, and completed with **JWT authentication**.

The data model follows this EER schema: `categories` → `products` → `orders` ← `customers`. A separate `users` table handles authentication.

This document is the **complete specification** of the project: it is meant to be followed branch by branch.

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
| Migrations & Seeders | Sequelize CLI | ^6.6.3 |
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
    │ 1
    │
    │ N
products (id, category_id, product_name, unit_price)
    │ 1
    │
    │ N
orders (id, customer_id, product_id, qty, total)
    │ N
    │
    │ 1
customers (id, first_name, last_name, tel, email, address)
```

### Auth data (RBAC + token lifecycle)

```
users ──< role_user >── roles ──< role_permission >── permissions
  │
  ├──< blacklisted_tokens
  ├──< activation_tokens
  └──< password_reset_tokens
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

**role_user** (M:M users ↔ roles)
| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | FK → users.id, NOT NULL |
| role_id | BIGINT | FK → roles.id, NOT NULL |

**role_permission** (M:M roles ↔ permissions)
| Column | Type | Constraints |
|---|---|---|
| role_id | BIGINT | FK → roles.id, NOT NULL |
| permission_id | BIGINT | FK → permissions.id, NOT NULL |

**blacklisted_tokens**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK → users.id |
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
| user_id | BIGINT | FK → users.id |
| token | VARCHAR(255) | |
| created_at | DATETIME | NOT NULL |
| expires_at | DATETIME | |
| validated_at | DATETIME | |

**password_reset_tokens**
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK → users.id |
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
| category_id | INTEGER | FK → categories.id, NOT NULL |
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
| customer_id | INTEGER | FK → customers.id, NOT NULL |
| product_id | INTEGER | FK → products.id, NOT NULL |
| qty | FLOAT | NOT NULL, > 0 |
| total | FLOAT | NOT NULL, computed = qty × unit_price |

## Branching strategy

| Branch | Role |
|---|---|
| `master` | Code stable, production-ready. Pas de commits directs — merges uniquement depuis `develop`. |
| `develop` | Branche d'intégration. Toutes les branches `feature/*` y sont mergées. |
| `feature/api/core-architecture` | Fondation technique : structure `src/`, configuration, dépendances, utilitaires partagés, middleware d'erreur. |
| `feature/api/categories` | Module `Category` : model, repository, service, controller, routes, validation, tests. |
| `feature/api/products` | Module `Product` avec relation vers `Category`. |
| `feature/api/customers` | Module `Customer`. |
| `feature/api/orders` | Module `Order` avec logique métier (calcul `total`). |
| `feature/api/auth` | Authentification JWT : register, login, middleware protect, User model. |
| `feature/frontend/core-architecture` | Structure de base React : Vite, routing, Axios, Navbar. |
| `feature/frontend/categories` | Feature `categories` : service, hook, composants, page. |
| `feature/frontend/products` | Feature `products`. |
| `feature/frontend/customers` | Feature `customers`. |
| `feature/frontend/orders` | Feature `orders` avec calcul automatique du total. |
| `feature/frontend/auth` | Pages Login/Register, routes protégées, stockage et envoi du JWT. |

Chaque feature est développée sur sa propre branche, puis mergée dans `develop` via un **Pull Request documenté**.

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
│   │   │   │   └── config.js         ← config sequelize-cli (lit .env)
│   │   │   ├── models/
│   │   │   │   ├── index.js          ← auto-loader sequelize-cli
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
│   │   │   └── auth.middleware.js    ← JWT verify; protects private routes
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

Fondation technique partagée par tout le backend. Contient tout ce qui sera réutilisé par chaque module.

### Tasks

- [x] Mettre à jour `backend/package.json` : Express 5, Sequelize 6, mysql2 3, dotenv, nodemon, jest, supertest
- [x] Ajouter les dépendances auth : passport, passport-local, passport-jwt, jsonwebtoken, bcryptjs
- [x] Créer `backend/.env.example`
- [x] Créer `backend/.sequelizerc`
- [x] Créer `src/config/env.js`
- [x] Créer `src/config/database.js`
- [x] Créer `src/database/config/config.js`
- [x] Créer `src/database/models/index.js`
- [x] Créer `src/database/repositories/` (dossier, rempli branche par branche)
- [x] Créer `src/database/migrations/` et `src/database/seeders/` (dossiers vides)
- [x] Créer `src/shared/utils/apiResponse.js`
- [x] Créer `src/shared/utils/catchAsync.js`
- [x] Créer `src/middlewares/error.middleware.js`
- [x] Créer `src/middlewares/auth.middleware.js` (squelette, implémenté dans feature/api/auth)
- [x] Créer `src/modules/auth/` (dossier, implémenté dans feature/api/auth)
- [x] Créer `src/app.js`
- [x] Créer `src/server.js`
- [x] Supprimer anciens fichiers scaffold express-generator
- [x] Écrire les tests unitaires (`apiResponse`, `catchAsync`, `error.middleware`)

## feature/api/categories

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/categories` | Liste toutes les catégories |
| GET | `/api/categories/:id` | Détail d'une catégorie |
| POST | `/api/categories` | Créer une catégorie |
| PUT | `/api/categories/:id` | Mettre à jour une catégorie |
| DELETE | `/api/categories/:id` | Supprimer une catégorie |

### Tasks

- [ ] `src/database/models/category.js`
- [ ] Migration `create-categories`
- [ ] Seeder catégories
- [ ] `src/database/repositories/category.repository.js`
- [ ] `src/modules/categories/category.validation.js`
- [ ] `src/modules/categories/category.service.js`
- [ ] `src/modules/categories/category.controller.js`
- [ ] `src/modules/categories/category.routes.js`
- [ ] Monter le router dans `src/app.js`
- [ ] Tests unitaires du service (Jest + mocks)
- [ ] Tests d'intégration des routes (Supertest)

## feature/api/products

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/products` | Liste tous les produits (avec catégorie) |
| GET | `/api/products/:id` | Détail d'un produit |
| POST | `/api/products` | Créer un produit |
| PUT | `/api/products/:id` | Mettre à jour un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |

### Tasks

- [ ] `src/database/models/product.js` — association `belongsTo Category`
- [ ] Migration et seeder produits
- [ ] `src/database/repositories/product.repository.js` (JOIN avec Category)
- [ ] `src/modules/products/product.validation.js`
- [ ] `src/modules/products/product.service.js`
- [ ] `src/modules/products/product.controller.js`
- [ ] `src/modules/products/product.routes.js`
- [ ] Monter le router dans `src/app.js`
- [ ] Tests unitaires et d'intégration

## feature/api/customers

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/customers` | Liste tous les clients |
| GET | `/api/customers/:id` | Détail d'un client |
| POST | `/api/customers` | Créer un client |
| PUT | `/api/customers/:id` | Mettre à jour un client |
| DELETE | `/api/customers/:id` | Supprimer un client |

### Tasks

- [ ] `src/database/models/customer.js`
- [ ] Migration et seeder customers
- [ ] `src/database/repositories/customer.repository.js`
- [ ] `src/modules/customers/customer.validation.js`
- [ ] `src/modules/customers/customer.service.js`
- [ ] `src/modules/customers/customer.controller.js`
- [ ] `src/modules/customers/customer.routes.js`
- [ ] Monter le router dans `src/app.js`
- [ ] Tests unitaires et d'intégration

## feature/api/orders

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/orders` | Liste toutes les commandes (avec customer et product) |
| GET | `/api/orders/:id` | Détail d'une commande |
| POST | `/api/orders` | Créer une commande (`total` calculé automatiquement) |
| PUT | `/api/orders/:id` | Mettre à jour une commande |
| DELETE | `/api/orders/:id` | Supprimer une commande |

### Tasks

- [ ] `src/database/models/order.js` — associations `belongsTo Customer` et `belongsTo Product`
- [ ] Migration et seeder orders
- [ ] `src/database/repositories/order.repository.js` (JOIN avec Customer et Product)
- [ ] `src/modules/orders/order.validation.js`
- [ ] `src/modules/orders/order.service.js` — logique métier : `total = qty × unit_price`
- [ ] `src/modules/orders/order.controller.js`
- [ ] `src/modules/orders/order.routes.js`
- [ ] Monter le router dans `src/app.js`
- [ ] Tests unitaires (calcul du total) et d'intégration

## feature/api/auth

Authentification JWT avec RBAC (Role-Based Access Control), cycle de vie complet des tokens (blacklist à la déconnexion), activation de compte et réinitialisation de mot de passe — basé sur le diagramme EER `EER (2).png`.

### Endpoints

| Method | URL | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Non | Créer un compte (enabled=false, envoie activation token) |
| GET | `/api/auth/activate/:token` | Non | Activer le compte (enabled=true) |
| POST | `/api/auth/login` | Non | Authentifier, retourne un JWT |
| POST | `/api/auth/logout` | Oui | Blacklister le JWT courant |
| GET | `/api/auth/me` | Oui | Retourne l'utilisateur connecté avec ses rôles |
| POST | `/api/auth/forgot-password` | Non | Envoyer un token de réinitialisation |
| POST | `/api/auth/reset-password/:token` | Non | Réinitialiser le mot de passe |

### JWT flow avec blacklist

```
Client → POST /api/auth/login → { token: "eyJ..." }
Client → GET /api/categories (Authorization: Bearer eyJ...) → 200 OK
Client → POST /api/auth/logout (Authorization: Bearer eyJ...) → token blacklisté
Client → GET /api/categories (Authorization: Bearer eyJ...) → 401 Unauthorized
```

### RBAC

```
Utilisateur admin  → rôle ADMIN  → permissions [categories:write, products:write, ...]
Utilisateur normal → rôle USER   → permissions [categories:read, products:read, ...]
```

### Tasks

**Models & migrations**
- [ ] `src/database/models/user.js` — first_name, last_name, email, password, enabled, account_locked
- [ ] `src/database/models/role.js`
- [ ] `src/database/models/permission.js`
- [ ] `src/database/models/blacklistedToken.js`
- [ ] `src/database/models/activationToken.js`
- [ ] `src/database/models/passwordResetToken.js`
- [ ] Associations : User belongsToMany Role via role_user, Role belongsToMany Permission via role_permission
- [ ] Migrations pour toutes les tables auth
- [ ] Seeder : rôles ADMIN et USER, permissions CRUD par ressource

**Repositories**
- [ ] `src/database/repositories/user.repository.js`
- [ ] `src/database/repositories/token.repository.js` (blacklist + activation + reset)

**Module auth**
- [ ] `src/modules/auth/auth.validation.js`
- [ ] `src/modules/auth/auth.service.js` — bcrypt, jwt.sign, blacklist check, RBAC check
- [ ] `src/modules/auth/auth.controller.js`
- [ ] `src/modules/auth/auth.routes.js`

**Infrastructure**
- [ ] Implémenter `src/middlewares/auth.middleware.js` — passport-jwt strategy + blacklist check
- [ ] `src/config/passport.js` — configuration de la stratégie passport-jwt
- [ ] Monter le router dans `src/app.js`

**Tests**
- [ ] Tests unitaires service (bcrypt, jwt, RBAC)
- [ ] Tests d'intégration register / activate / login / logout / me / reset

## feature/frontend/core-architecture

Structure de base React avec Vite. Tout ce dont les features auront besoin : routing, Axios configuré, layout, composant de route protégée.

### Tasks

- [ ] Initialiser Vite + React 19
- [ ] Installer Bootstrap, React Router, Axios, Formik, Yup, React Bootstrap
- [ ] Créer `src/lib/axios.js` — instance Axios avec `baseURL` et intercepteur JWT
- [ ] Créer `src/app/App.jsx`, `src/app/router.jsx`, `src/app/providers.jsx`
- [ ] Créer `src/shared/components/Navbar.jsx`
- [ ] Créer `src/shared/components/ProtectedRoute.jsx` (squelette)
- [ ] Mettre à jour `src/index.js`

## feature/frontend/categories

### Tasks

- [ ] `src/features/categories/services/categoryApi.js`
- [ ] `src/features/categories/hooks/useCategories.js`
- [ ] `src/features/categories/components/CategoryList.jsx`
- [ ] `src/features/categories/components/CategoryForm.jsx` (Formik + Yup)
- [ ] `src/features/categories/pages/CategoriesPage.jsx`
- [ ] `src/features/categories/index.js`
- [ ] Ajouter la route `/categories` dans `router.jsx`
- [ ] Tests unitaires hook et composants

## feature/frontend/products

### Tasks

- [ ] Service, hook, composants, page pour `products`
- [ ] `ProductForm` : select de catégorie (cross-feature import autorisé dans les composants)
- [ ] Ajouter la route `/products` dans `router.jsx`
- [ ] Tests

## feature/frontend/customers

### Tasks

- [ ] Service, hook, composants, page pour `customers`
- [ ] Ajouter la route `/customers` dans `router.jsx`
- [ ] Tests

## feature/frontend/orders

### Tasks

- [ ] Service, hook, composants, page pour `orders`
- [ ] `OrderForm` : select customer + select product, calcul automatique `total = qty × unit_price`
- [ ] Ajouter la route `/orders` dans `router.jsx`
- [ ] Tests e2e Cypress

## feature/frontend/auth

### Tasks

- [ ] `src/features/auth/services/authApi.js` — appels register / login / me
- [ ] `src/features/auth/hooks/useAuth.js` — gestion du token (localStorage), état utilisateur
- [ ] `src/features/auth/components/LoginForm.jsx` (Formik + Yup)
- [ ] `src/features/auth/components/RegisterForm.jsx`
- [ ] `src/features/auth/pages/LoginPage.jsx`
- [ ] `src/features/auth/pages/RegisterPage.jsx`
- [ ] `src/features/auth/index.js`
- [ ] Implémenter `src/shared/components/ProtectedRoute.jsx` — redirige si non authentifié
- [ ] Mettre à jour l'intercepteur Axios dans `src/lib/axios.js` pour envoyer le JWT
- [ ] Protéger les routes privées dans `router.jsx`
- [ ] Tests unitaires hook et composants

## Order of work

1. `feature/api/core-architecture` → merge `develop`
2. `feature/api/categories` → merge `develop`
3. `feature/api/products` → merge `develop`
4. `feature/api/customers` → merge `develop`
5. `feature/api/orders` → merge `develop`
6. `feature/api/auth` → merge `develop`
7. `feature/frontend/core-architecture` → merge `develop`
8. `feature/frontend/categories` → merge `develop`
9. `feature/frontend/products` → merge `develop`
10. `feature/frontend/customers` → merge `develop`
11. `feature/frontend/orders` → merge `develop`
12. `feature/frontend/auth` → merge `develop`
13. `develop` → `master` une fois tout validé

## Code conventions

### Backend
- Flux de requête : `Route → auth.middleware (optional) → validation → Controller → Service → Repository → DB`
- Le **repository** est la seule couche autorisée à accéder à la base de données
- Le **service** contient la logique métier pure (pas de `req`/`res`)
- Le **controller** gère uniquement `req`/`res` et délègue au service
- Toujours utiliser `catchAsync` dans les controllers (pas de `try/catch` manuel)
- Toutes les réponses passent par `success()` ou `error()` de `apiResponse.js`
- Commits atomiques : un commit par fichier créé ou modifié, format conventionnel

### Frontend
- Une feature = un dossier autonome dans `src/features/`
- Le hook est la seule couche autorisée à appeler le service API
- Les composants reçoivent les données et callbacks en props, sans appel API direct
- Cross-feature imports autorisés uniquement dans les composants `Form`

## How to follow this tutorial

1. Cloner le dépôt et se positionner sur `develop`
2. Démarrer MySQL localement et créer la base `mern_db`
3. Copier `backend/.env.example` → `backend/.env` et renseigner les credentials
4. Checkout `feature/api/core-architecture` et suivre sa checklist
5. Continuer branche par branche dans l'ordre défini ci-dessus
6. Lancer le backend : `cd backend && yarn dev` → `http://localhost:3001`
7. Lancer le frontend : `cd frontend && yarn dev` → `http://localhost:5173`
