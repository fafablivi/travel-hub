# Travel Hub API

API Node.js pour la gestion d'offres de voyage, recommandations de villes, et sessions utilisateurs.

## Lancement du projet

1. Cloner le dépôt

```
git clone https://github.com/fafablivi/travel-hub.git
cd travel-hub-api
```

2. Lancer les services avec Docker

```
docker compose up -d
```

3. Installer les dépendances Node.js

```
npm install
```

4. Démarrer l'API

```
node index.js
````

## Endpoints disponibles

### POST /login

Génère un token de session Redis.

Body :
```json
{ "userId": "u42" }
````

Réponse :

```json
{ "token": "<uuid>", "expires_in": 900 }
```

---

### GET /offers?from=XXX\&to=XXX\&limit=3

Retourne un tableau d'offres triées par prix.

---

### GET /offers/\:id

Retourne les détails complets d'une offre avec les offres similaires (relatedOffers).

---

### POST /offers

Ajoute une nouvelle offre dans MongoDB et publie un message sur Redis (canal offers\:new).

---

### GET /reco?city=XXX\&k=3

Retourne les codes des villes proches d'une ville donnée selon Neo4j.

---

## Tester Redis Pub/Sub

Dans un terminal à la racine du projet :

```
docker exec -it redis redis-cli
SUBSCRIBE offers:new
```