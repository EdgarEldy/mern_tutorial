# 📁 Structure Express/Node.js — Grands Projets (Module-based)

## Vue d'ensemble

```
mon-grand-projet-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── modules/
│   ├── middlewares/
│   ├── shared/
│   └── database/
├── tests/
├── logs/
├── .env
├── .env.production
├── .eslintrc.js
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 📂 Détail des dossiers

### `src/` — Point d'entrée

```
src/
├── app.js             # Initialisation Express (middlewares, routes)
└── server.js          # Démarrage du serveur (listen)
```

---

### `src/config/` — Configuration globale

```
config/
├── env.js             # Variables d'environnement
├── database.js        # Connexion DB
└── logger.js          # Configuration des logs
```

---

### `src/modules/` — 🔑 Cœur de l'architecture

Chaque module représente un **domaine métier autonome**.

```
modules/
├── auth/
│   ├── auth.routes.js
│   ├── auth.controller.js
│   ├── auth.service.js
│   └── auth.validation.js
│
├── users/
│   ├── user.routes.js
│   ├── user.controller.js
│   ├── user.service.js
│   ├── user.model.js          # Schéma Mongoose / Prisma
│   └── user.validation.js
│
└── products/
    ├── product.routes.js
    ├── product.controller.js
    ├── product.service.js
    ├── product.model.js
    └── product.validation.js
```

---

### `src/middlewares/` — Middlewares globaux

```
middlewares/
├── auth.middleware.js         # JWT, sessions
├── error.middleware.js        # Gestion centralisée des erreurs
├── validate.middleware.js     # Validation des requêtes
└── rateLimiter.js
```

---

### `src/shared/` — Utilitaires partagés

```
shared/
├── utils/
│   ├── apiResponse.js         # Format de réponse standard
│   ├── catchAsync.js          # Wrapper try/catch
│   └── helpers.js
├── constants/
│   └── httpStatus.js
└── types/                     # Types JSDoc / TypeScript
```

---

### `src/database/` — Couche base de données

```
database/
├── migrations/
├── seeders/
└── repositories/              # Pattern Repository (abstraction DB)
    ├── user.repository.js
    └── product.repository.js
```

---

### `tests/` — Tests

```
tests/
├── unit/
├── integration/
└── e2e/
```

---

## 🔄 Flux d'une requête HTTP

```
Request
  → Route          (définit l'URL et la méthode)
  → Middleware     (auth, validation, rate limit...)
  → Controller     (reçoit req/res, délègue la logique)
  → Service        (logique métier pure)
  → Repository     (accès à la base de données)
  → Response
```

---

## 📐 Responsabilités de chaque couche

| Couche | Rôle |
|--------|------|
| **Route** | Déclare les endpoints et attache les middlewares |
| **Controller** | Gère req/res, appelle le service, renvoie la réponse |
| **Service** | Contient toute la logique métier |
| **Repository** | Seul autorisé à parler à la base de données |
| **Model** | Définit le schéma de données (Mongoose, Prisma...) |
| **Middleware** | Traitement transversal (auth, erreurs, logs...) |

---

## 💡 Pourquoi `modules/` et pas `features/` ?

| Terme | Utilisé plutôt en | Connotation |
|-------|-------------------|-------------|
| `features/` | React, frontend | Fonctionnalité produit |
| `modules/` | Node.js, backend | Bloc technique encapsulé |
| `domains/` | DDD avancé | Domaine métier |
| `resources/` | REST API strict | Ressource HTTP |

> Ce qui compte, c'est la **cohérence au sein du projet**.  
> Documenter ce choix dans un `ARCHITECTURE.md` est une bonne pratique en équipe.

---

## ✅ Avantages de cette architecture

- **Scalable** — ajout de nouveaux modules sans impact sur l'existant
- **Testable** — chaque couche est indépendante et mockable
- **Lisible** — on sait immédiatement où chercher un fichier
- **Maintenable** — séparation claire des responsabilités
