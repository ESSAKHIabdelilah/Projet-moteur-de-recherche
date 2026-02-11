# 📚 Moteur de Recherche de Livres

## 🎯 Description du Projet

Ce projet est un **moteur de recherche intelligent** pour une collection de livres numériques provenant du **Projet Gutenberg**. Il permet de rechercher des livres par mots-clés et propose des recommandations de livres similaires basées sur l'analyse du contenu.

---

## 🏗️ Architecture du Projet

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │SearchBar │  │ ResultsList  │  │ SimilarBooks  │             │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘             │
│       │               │                  │                      │
│       └───────────────┴──────────────────┘                      │
│                       │ HTTP (fetch)                            │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────────┐
│                      BACKEND (Flask API)                          │
│  ┌────────────────────┐    ┌────────────────────────────────┐    │
│  │ /api/search?q=...  │    │ /api/similar/<book_id>         │    │
│  │   Recherche TF-IDF │    │   Recommandations Cosinus      │    │
│  └─────────┬──────────┘    └──────────────┬─────────────────┘    │
│            │                              │                       │
│            └──────────────┬───────────────┘                       │
│                           │ SQL                                   │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                     BASE DE DONNÉES (MySQL)                       │
│  ┌─────────────┐  ┌────────────────┐  ┌──────────────────┐       │
│  │   Livres    │  │ Index_Inverse  │  │ Graphe_Jaccard   │       │
│  │ 644 livres  │  │  7.3M entrées  │  │ 1.2M similarités │       │
│  └─────────────┘  └────────────────┘  └──────────────────┘       │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Technologies Utilisées

### Frontend

| Technologie      | Version | Utilisation            |
| ---------------- | ------- | ---------------------- |
| **React**        | 18.2.0  | Framework UI           |
| **CSS3**         | -       | Animations & Design    |
| **Google Fonts** | -       | Playfair Display, Lora |

### Backend

| Technologie      | Version | Utilisation           |
| ---------------- | ------- | --------------------- |
| **Python**       | 3.x     | Langage backend       |
| **Flask**        | 3.x     | API REST              |
| **Flask-CORS**   | -       | Cross-Origin Requests |
| **Scikit-learn** | -       | Calcul TF-IDF         |

### Base de Données

| Technologie       | Version | Utilisation          |
| ----------------- | ------- | -------------------- |
| **MySQL/MariaDB** | XAMPP   | Stockage des données |

---

## 📊 Algorithmes Implémentés

### 1. TF-IDF (Term Frequency - Inverse Document Frequency)

Le **TF-IDF** est une mesure statistique qui évalue l'importance d'un mot dans un document par rapport à une collection de documents.

**Formule :**

```
TF-IDF(t,d) = TF(t,d) × IDF(t)

où:
- TF(t,d) = fréquence du terme t dans le document d
- IDF(t) = log(N / df(t))
- N = nombre total de documents
- df(t) = nombre de documents contenant le terme t
```

**Configuration utilisée :**

- Mots de 4+ lettres uniquement
- Maximum 15 000 features
- Minimum 2 occurrences dans le corpus
- Stop words anglais exclus

### 2. Similarité Cosinus

La **similarité cosinus** mesure la similarité entre deux documents en calculant le cosinus de l'angle entre leurs vecteurs TF-IDF.

**Formule :**

```
cos(θ) = (A · B) / (||A|| × ||B||)

où:
- A · B = produit scalaire des vecteurs
- ||A||, ||B|| = normes des vecteurs
```

**Seuil utilisé :** score > 0.05 pour être considéré comme similaire

### 3. Système de Ranking Hybride

La recherche combine deux facteurs :

```
Score Final = (TF-IDF × 0.7) + (Popularité × 0.3)
```

---

## 🗄️ Structure de la Base de Données

### Table `Livres`

| Colonne      | Type         | Description         |
| ------------ | ------------ | ------------------- |
| id           | INT (PK)     | Identifiant unique  |
| gutenberg_id | INT          | ID Projet Gutenberg |
| titre        | VARCHAR(255) | Titre du livre      |
| contenu      | LONGTEXT     | Texte complet       |
| nb_mots      | INT          | Nombre de mots      |

### Table `Index_Inverse`

| Colonne        | Type         | Description        |
| -------------- | ------------ | ------------------ |
| id             | INT (PK)     | Identifiant unique |
| mot            | VARCHAR(100) | Mot indexé         |
| livre_id       | INT (FK)     | Référence au livre |
| nb_occurrences | INT          | Fréquence du mot   |
| tfidf_final    | FLOAT        | Score TF-IDF       |

### Table `Graphe_Jaccard`

| Colonne           | Type     | Description         |
| ----------------- | -------- | ------------------- |
| livre_1_id        | INT (FK) | Premier livre       |
| livre_2_id        | INT (FK) | Second livre        |
| indice_similarite | FLOAT    | Score de similarité |

### Table `Stats_Clicks`

| Colonne  | Type     | Description     |
| -------- | -------- | --------------- |
| livre_id | INT (FK) | Livre cliqué    |
| nb_clics | INT      | Nombre de clics |

---

## 📈 Statistiques du Projet

| Métrique                 | Valeur        |
| ------------------------ | ------------- |
| 📚 Nombre de livres      | **644**       |
| 📝 Entrées index inverse | **7 299 560** |
| 🔗 Paires de similarité  | **1 236 533** |
| 📖 Mots min. par livre   | **10 000+**   |

---

## 🚀 Installation & Lancement

### Prérequis

- Node.js 16+
- Python 3.8+
- XAMPP (MySQL/MariaDB)

### 1. Base de Données

```bash
# Démarrer XAMPP (Apache + MySQL)
# Importer la base via phpMyAdmin ou ligne de commande
mysql -u root bd_des_livres < bd_des_livres.sql
```

### 2. Backend Flask

```bash
cd Projet-moteur-de-recherche
pip install flask flask-cors mysql-connector-python
python BackEnd.py
```

Le serveur démarre sur `http://localhost:5000`

### 3. Frontend React

```bash
cd frontend
npm install
npm start
```

L'application s'ouvre sur `http://localhost:3000`

---

## 🎨 Fonctionnalités de l'Interface

### Page Principale

- 🔍 **Barre de recherche** avec design élégant
- 📖 **Background animé** avec livres défilants
- ✨ **Animations fluides** sur les interactions

### Résultats de Recherche

- 📋 **Liste des livres** correspondants au mot-clé
- 📊 **Score de pertinence** TF-IDF affiché
- 👆 **Compteur de clics** (popularité)

### Recommandations

- 📚 **Livres similaires** basés sur le contenu
- 📈 **Indice de similarité** en pourcentage
- 🪟 **Modal animé** pour l'affichage

---

## 📁 Structure des Fichiers

```
Projet-moteur-de-recherche/
├── 📄 BackEnd.py                    # API Flask
├── 📄 script_scraping.py            # Scraping Gutenberg
├── 📄 script_calcule_tfidf.py       # Calcul TF-IDF
├── 📄 script_Cosine_similarité.py   # Calcul similarités
├── 📄 .gitignore
├── 📄 README.md
│
└── 📁 frontend/
    ├── 📁 public/
    │   ├── 📄 index.html
    │   └── 📁 images/               # Couvertures de livres
    │
    └── 📁 src/
        ├── 📄 App.js                # Composant principal
        ├── 📄 App.css               # Styles principaux
        ├── 📄 index.js
        │
        └── 📁 components/
            ├── 📄 SearchBar.js/css      # Barre de recherche
            ├── 📄 ResultsList.js/css    # Liste des résultats
            ├── 📄 ResultCard.js/css     # Carte de livre
            ├── 📄 SimilarBooks.js/css   # Modal recommandations
            └── 📄 BookBackground.js/css # Background animé
```

---

## 👨‍💻 Auteur

**ESSAKH Abdelilah**

---

## 📜 Licence

Ce projet est réalisé dans un cadre éducatif (CFA).
Les textes proviennent du **Projet Gutenberg** (domaine public).

---

## 🔮 Améliorations Futures

- [ ] Recherche multi-mots avec opérateurs booléens
- [ ] Filtres par auteur, date, genre
- [ ] Historique de recherche
- [ ] Mode sombre / clair
- [ ] Export des résultats en PDF
- [ ] Pagination des résultats
- [ ] Cache des requêtes fréquentes
