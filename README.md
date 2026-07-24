# MERN Tutorial

A hands-on walkthrough of building a full-stack CRUD application with **Express 5 / Node.js** (backend) and **React 17** (frontend), organized into Git branches that progressively cover the key concepts of the MERN stack — adapted here with **MySQL** and **Sequelize ORM** instead of MongoDB.

The data model follows this EER schema: `categories` → `products` → `orders` ← `customers`.

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
- [feature/frontend/config](#featurefrontendconfig)
- [feature/frontend/categories](#featurefrontendcategories)
- [feature/frontend/products](#featurefrontendproducts)
- [feature/frontend/customers](#featurefrontendcustomers)
- [feature/frontend/orders](#featurefrontendorders)
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
| Environment | dotenv | ^16.5.0 |
| Tests | Jest + Supertest | ^29.7.0 / ^7.1.0 |
| Dev server | nodemon | ^3.1.10 |

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

### Column details

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
| `feature/frontend/config` | Structure de base React : `src/app/`, `src/lib/`, `src/shared/`, router, navbar. |
| `feature/frontend/categories` | Feature `categories` : service, hook, composants, page. |
| `feature/frontend/products` | Feature `products`. |
| `feature/frontend/customers` | Feature `customers`. |
| `feature/frontend/orders` | Feature `orders` avec calcul automatique du total. |

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
│   │   │   │   ├── category.js
│   │   │   │   ├── product.js
│   │   │   │   ├── customer.js
│   │   │   │   └── order.js
│   │   │   ├── repositories/
│   │   │   │   ├── category.repository.js
│   │   │   │   ├── product.repository.js
│   │   │   │   ├── customer.repository.js
│   │   │   │   └── order.repository.js
│   │   │   ├── migrations/
│   │   │   └── seeders/
│   │   ├── modules/
│   │   │   ├── categories/
│   │   │   │   ├── category.routes.js
│   │   │   │   ├── category.controller.js
│   │   │   │   ├── category.service.js
│   │   │   │   └── category.validation.js
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── orders/
│   │   ├── middlewares/
│   │   │   └── error.middleware.js
│   │   └── shared/
│   │       └── utils/
│   │           ├── apiResponse.js
│   │           └── catchAsync.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── logs/
│   ├── .sequelizerc
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── router.jsx
│   │   │   └── providers.jsx
│   │   ├── features/
│   │   │   ├── categories/
│   │   │   │   ├── services/categoryApi.js
│   │   │   │   ├── hooks/useCategories.js
│   │   │   │   ├── components/CategoryList.jsx
│   │   │   │   ├── components/CategoryForm.jsx
│   │   │   │   ├── pages/CategoriesPage.jsx
│   │   │   │   └── index.js
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── orders/
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── Navbar.jsx
│   │   ├── lib/
│   │   │   └── axios.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Standard response format

Every API response is wrapped in a consistent envelope:

```json
{ "success": true,  "message": "Category created successfully", "data": { ... } }
{ "success": false, "message": "Category not found", "data": null }
```

Implemented in `src/shared/utils/apiResponse.js`:

```js
const success = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const error = (res, message = 'Error', statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });
```

## feature/api/core-architecture

Fondation technique partagée par tout le backend. Renommée depuis `feature/api/config` pour mieux refléter son périmètre : structure, configuration, concerns transversaux.

### Tasks

- [ ] Mettre à jour `backend/package.json` : Express 5, Sequelize 6, mysql2 3, dotenv, nodemon, jest, supertest
- [ ] Créer `backend/.env` et `backend/.env.example`
- [ ] Créer `backend/.sequelizerc` (pointe vers `src/database/`)
- [ ] Créer `src/config/env.js` — centralise les variables d'environnement
- [ ] Créer `src/config/database.js` — instance Sequelize pour l'application
- [ ] Créer `src/database/config/config.js` — config sequelize-cli (lit `.env`)
- [ ] Déplacer `models/index.js` → `src/database/models/index.js`
- [ ] Déplacer `migrations/` → `src/database/migrations/`
- [ ] Déplacer `seeders/` → `src/database/seeders/`
- [ ] Créer `src/database/repositories/` (dossier, rempli par les branches suivantes)
- [ ] Créer `src/shared/utils/apiResponse.js`
- [ ] Créer `src/shared/utils/catchAsync.js`
- [ ] Créer `src/middlewares/error.middleware.js`
- [ ] Créer `src/app.js` — initialisation Express avec middleware stack
- [ ] Créer `src/server.js` — démarrage du serveur avec connexion DB
- [ ] Supprimer `backend/app.js`, `backend/bin/`, `backend/config/config.json`, `backend/models/`, `backend/routes/`
- [ ] Écrire les tests unitaires (`apiResponse`, `catchAsync`, `error.middleware`)

## feature/api/categories

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/categories` | Liste toutes les catégories |
| GET | `/categories/:id` | Détail d'une catégorie |
| POST | `/categories` | Créer une catégorie |
| PUT | `/categories/:id` | Mettre à jour une catégorie |
| DELETE | `/categories/:id` | Supprimer une catégorie |

### Tasks

- [ ] `src/database/models/category.js` — modèle Sequelize
- [ ] Migration `create-categories`
- [ ] Seeder catégories
- [ ] `src/database/repositories/category.repository.js`
- [ ] `src/modules/categories/category.validation.js`
- [ ] `src/modules/categories/category.service.js`
- [ ] `src/modules/categories/category.controller.js`
- [ ] `src/modules/categories/category.routes.js`
- [ ] Tests unitaires du service (Jest + mocks)
- [ ] Tests d'intégration des routes (Supertest)

## feature/api/products

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/products` | Liste tous les produits (avec catégorie) |
| GET | `/products/:id` | Détail d'un produit |
| POST | `/products` | Créer un produit |
| PUT | `/products/:id` | Mettre à jour un produit |
| DELETE | `/products/:id` | Supprimer un produit |

### Tasks

- [ ] `src/database/models/product.js` — association `belongsTo Category`
- [ ] Migration et seeder produits
- [ ] `src/database/repositories/product.repository.js` (JOIN avec Category)
- [ ] `src/modules/products/product.validation.js`
- [ ] `src/modules/products/product.service.js`
- [ ] `src/modules/products/product.controller.js`
- [ ] `src/modules/products/product.routes.js`
- [ ] Tests unitaires et d'intégration

## feature/api/customers

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/customers` | Liste tous les clients |
| GET | `/customers/:id` | Détail d'un client |
| POST | `/customers` | Créer un client |
| PUT | `/customers/:id` | Mettre à jour un client |
| DELETE | `/customers/:id` | Supprimer un client |

### Tasks

- [ ] `src/database/models/customer.js`
- [ ] Migration et seeder customers
- [ ] `src/database/repositories/customer.repository.js`
- [ ] `src/modules/customers/customer.validation.js`
- [ ] `src/modules/customers/customer.service.js`
- [ ] `src/modules/customers/customer.controller.js`
- [ ] `src/modules/customers/customer.routes.js`
- [ ] Tests unitaires et d'intégration

## feature/api/orders

### Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/orders` | Liste toutes les commandes (avec customer et product) |
| GET | `/orders/:id` | Détail d'une commande |
| POST | `/orders` | Créer une commande (`total` calculé automatiquement) |
| PUT | `/orders/:id` | Mettre à jour une commande |
| DELETE | `/orders/:id` | Supprimer une commande |

### Tasks

- [ ] `src/database/models/order.js` — associations `belongsTo Customer` et `belongsTo Product`
- [ ] Migration et seeder orders
- [ ] `src/database/repositories/order.repository.js` (JOIN avec Customer et Product)
- [ ] `src/modules/orders/order.validation.js`
- [ ] `src/modules/orders/order.service.js` — logique métier : `total = qty × unit_price`
- [ ] `src/modules/orders/order.controller.js`
- [ ] `src/modules/orders/order.routes.js`
- [ ] Tests unitaires (calcul du total, règles métier) et d'intégration

## feature/frontend/config

### Tasks

- [ ] Ajouter `bootstrap` aux dépendances frontend
- [ ] Créer `src/lib/axios.js` — instance Axios configurée avec `baseURL`
- [ ] Créer `src/app/App.jsx`, `src/app/router.jsx`, `src/app/providers.jsx`
- [ ] Créer `src/shared/components/Navbar.jsx`
- [ ] Mettre à jour `src/index.js` — importer Bootstrap CSS et `src/app/App`
- [ ] Supprimer l'ancien `src/App.js`

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

## Order of work

1. `feature/api/core-architecture` → merge `develop`
2. `feature/api/categories` → merge `develop`
3. `feature/api/products` → merge `develop`
4. `feature/api/customers` → merge `develop`
5. `feature/api/orders` → merge `develop`
6. `feature/frontend/config` → merge `develop`
7. `feature/frontend/categories` → merge `develop`
8. `feature/frontend/products` → merge `develop`
9. `feature/frontend/customers` → merge `develop`
10. `feature/frontend/orders` → merge `develop`
11. `develop` → `master` une fois tout validé

## Code conventions

### Backend
- Flux de requête : `Route → Middleware → Controller → Service → Repository → DB`
- Le **repository** est la seule couche autorisée à accéder à la base de données
- Le **service** contient la logique métier pure (pas de `req`/`res`)
- Le **controller** gère uniquement `req`/`res` et délègue au service
- Toujours utiliser `catchAsync` dans les controllers (pas de `try/catch` manuel)
- Toutes les réponses passent par `success()` ou `error()` de `apiResponse.js`
- Commits atomiques : un commit par fichier créé ou modifié, format conventionnel (`feat`, `fix`, `chore`, `test`, `refactor`)

### Frontend
- Une feature = un dossier autonome dans `src/features/`
- Le hook est la seule couche autorisée à appeler le service API
- Les composants reçoivent les données et callbacks en props, sans appel API direct
- Cross-feature imports autorisés uniquement dans les composants `Form` (ex: select de catégories dans `ProductForm`)

## How to follow this tutorial

1. Cloner le dépôt et se positionner sur `develop`
2. Démarrer MySQL localement et créer la base `mern_db`
3. Checkout `feature/api/core-architecture` et suivre sa checklist de tâches
4. Continuer branche par branche dans l'ordre défini ci-dessus
5. Lancer le backend : `cd backend && npm run dev` → `http://localhost:3001`
6. Lancer le frontend : `cd frontend && npm start` → `http://localhost:3000`
