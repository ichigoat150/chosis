
// Service worker : permet d'installer l'app et de jouer hors ligne.
// Change le numéro de version si tu veux forcer une mise à jour du cache.
const CACHE = "chosis-toi-v1";

const FICHIERS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./jeux/test/snake.html",
"./jeux/test/plateforme.html"
    "./jeux/snake/index.html",
    "./jeux/test/index.html"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) =>
            // un fichier manquant ne bloque pas l'installation
            Promise.all(FICHIERS.map((url) => cache.add(url).catch(() => {})))
        ).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

// Réseau d'abord (toujours la dernière version), cache en secours hors ligne.
self.addEventListener("fetch", (event) => {
    const requete = event.request;
    if (requete.method !== "GET" || new URL(requete.url).origin !== location.origin) return;

    event.respondWith(
        fetch(requete)
            .then((reponse) => {
                if (reponse.ok) {
                    const copie = reponse.clone();
                    caches.open(CACHE).then((cache) => cache.put(requete, copie));
                }
                return reponse;
            })
            .catch(() => caches.match(requete))
    );
});
