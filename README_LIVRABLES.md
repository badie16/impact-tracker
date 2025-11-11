# Dossier de Remise - Projet ImpactTracker

## 1. Rapport de Gouvernance

Le fichier **Rapport_ImpactTracker.pdf** contient :

- La charte projet
- L’architecture applicative
- La politique de sécurité
- Le tableau de bord de pilotage
- ...

---

## 2. Code Source du Prototype

Le dossier **impacttracker-code/** contient :

- Le code complet de l’application web **Next.js + Supabase**
- Le fichier **README.md** détaillant :
  - Les technologies utilisées
  - Les instructions d’installation et d’exécution
  - L’architecture du projet
  - Les rôles utilisateurs et scénarios de test

⚠️ **Remarque importante :**  
Le projet utilise **une base de données en ligne (Supabase)**.  
Pour des raisons de sécurité, le fichier **.env** (contenant les clés d’accès) **n’est pas inclus**.  
Ainsi, **la version locale ne fonctionnera pas sans ces variables d’environnement.**

---

## 3. Version Déployée (si disponible)

Une version hébergée du site est accessible ici :  
[https://impacttracker-one.vercel.app/](https://impacttracker-one.vercel.app)

---

## 4. Démonstration

Le fichier **Demonstration_ImpactTracker.pdf** contient :

- Des captures d’écran illustrant le fonctionnement du portail
- Le scénario de démonstration : connexion, ajout d’indicateurs, visualisation par donateur
- Les principaux parcours utilisateurs (Admin, Chef de Projet, Donateur)

---

## 5. Presentation

Le fichier **Presentation.pdf** contient :

- Une synthèse visuelle du projet ImpactTracker.
- Les objectifs du projet et les principes de Gouvernance des Systèmes d’Information appliqués.
- Les principales fonctionnalités (authentification, gestion de projets, suivi des indicateurs, tableau de bord des donateurs).
- ...

---

## Structure du rendu

```
ImpactTracker/
│
├── docs/
│   ├── Rapport_ImpactTracker.pdf
│   ├── Demonstration_ImpactTracker.pdf
│   └── Presentation.pdf
├── impacttracker-code/
│   ├── README.md
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── public/
│   └── ...
└── README_LIVRABLES.txt   ← (ce fichier)
```

---

## Remarque finale

Ce projet répond à la problématique initiale :

> _"Faciliter le suivi et la transparence des projets d’une ONG via un portail web sécurisé."_

Il respecte les principes de **gouvernance du SI**, de **sécurité**, et de **traçabilité** des données, conformément aux exigences du sujet.

---

**Auteur :** Badie Bahida Ahlam Arabi Salma Azrou
**Filière :** Sécurité IT et Confiance Numérique - ENSIASD  
**Date :** Novembre 2025
