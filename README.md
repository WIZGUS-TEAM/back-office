# Plugin DCF

## Vue d'ensemble

Le cœur du projet se trouve dans le dossier `src/plugins/dcf`. C'est ici que réside toute la logique métier et l'interface d'administration pour la gestion des dons et des causes caritatives.

## Structure principale

Le plugin est organisé en deux parties essentielles :

### Interface d'administration (`admin/`)
- Développée avec React et le Design System Strapi
- Gestion complète des dons et des causes via une interface moderne
- Pages principales :
  - Tableau de bord
  - Gestion des causes (actives et en attente)
  - Suivi des donations
  - Statistiques

### Serveur (`server/`)
- API RESTful pour la gestion des données
- Services métier pour la logique business
- Contrôleurs pour le traitement des requêtes
- Modèles de données pour les causes et les dons

## Points clés du plugin

- **Gestion des dons** : Interface complète pour suivre et gérer les donations
- **Administration des causes** : Workflow de validation et de suivi des causes caritatives
- **Interface intuitive** : Design System Strapi pour une expérience utilisateur cohérente
- **Architecture robuste** : Développé en TypeScript pour une meilleure maintenabilité
- **Intégration Strapi** : Utilisation optimale des fonctionnalités de Strapi v5

## Développement

Le plugin utilise les technologies modernes :
- TypeScript pour un typage fort
- React pour l'interface utilisateur
- Design System Strapi pour les composants
- API RESTful pour la communication client-serveur

Pour plus de détails sur l'implémentation, consultez les dossiers `admin/` et `server/` dans le code source.
