# 📁 Structure React — Grands Projets (Feature-based)

## Vue d'ensemble

```
mon-grand-projet/
├── public/
├── src/
│   ├── app/
│   ├── features/
│   ├── shared/
│   ├── lib/
│   ├── assets/
│   └── styles/
├── tests/
├── .env
├── .env.production
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.js
└── package.json
```

---

## 📂 Détail des dossiers

### `src/app/` — Configuration globale

```
app/
├── App.jsx            # Composant racine
├── router.jsx         # Routes principales
├── store.js           # Store Redux / Zustand
└── providers.jsx      # Providers globaux (theme, auth...)
```

---

### `src/features/` — 🔑 Cœur de l'architecture

Chaque feature représente un **domaine métier autonome**.

```
features/
├── auth/
│   ├── components/    # Composants propres à l'auth
│   ├── hooks/         # useAuth, useLogin...
│   ├── services/      # authApi.js
│   ├── store/         # authSlice.js (Redux)
│   ├── pages/         # LoginPage, RegisterPage
│   └── index.js       # Export public du module
│
├── dashboard/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── index.js
│
├── users/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── index.js
│
└── products/
    ├── components/
    ├── hooks/
    ├── pages/
    └── index.js
```

---

### `src/shared/` — Éléments partagés entre features

```
shared/
├── components/        # Composants UI génériques
│   ├── Button/
│   ├── Modal/
│   ├── Table/
│   └── Form/
├── hooks/             # Hooks génériques (useFetch, useDebounce...)
├── utils/             # Fonctions utilitaires
├── constants/         # Constantes globales
└── types/             # Types TypeScript partagés
```

---

### `src/lib/` — Configuration des librairies tierces

```
lib/
├── axios.js           # Instance Axios configurée
├── i18n.js            # Internationalisation
└── dayjs.js
```

---

### `src/assets/` & `src/styles/`

```
assets/
├── images/
└── fonts/

styles/
├── globals.css
├── variables.css
└── themes/
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

## 📐 Principes clés

### 1. Règle d'or des features

Chaque feature est un **module autonome**. Elle ne doit importer que depuis `shared/` ou `lib/`, jamais depuis une autre feature directement.

### 2. L'`index.js` comme contrat public

```js
// features/auth/index.js
export { LoginPage } from './pages/LoginPage';
export { useAuth } from './hooks/useAuth';
// Ce qui n'est pas exporté ici reste privé
```

### 3. Règle d'import stricte

| Import | Autorisé |
|--------|----------|
| `features/auth` → `shared/components` | ✅ |
| `features/auth` → `lib/axios` | ✅ |
| `features/auth` → `features/dashboard` | ❌ |

### 4. Quand créer une nouvelle feature ?

Dès qu'un domaine métier possède :
- Ses propres **pages**
- Son propre **état** (store)
- Ses propres **appels API**

---

## ✅ Avantages de cette architecture

- **Scalable** — facile d'ajouter de nouvelles features sans tout casser
- **Travail en équipe** — chaque équipe owns sa feature
- **Maintenable** — suppression ou refacto d'un module isolé
- **Lisible** — on sait immédiatement où chercher un fichier
