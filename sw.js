const PERCORSO="/calculate-shopping-cost-pwa";
const VERSIONE="v0.0.1";
const NOME_CACHE=`calculate-shopping-cost-pwa-${VERSIONE}`;

const URLS = [
    `${PERCORSO}/`,
    `${PERCORSO}/index.html`,
    `${PERCORSO}/index.js`,
    `${PERCORSO}/index.css`,
    `${PERCORSO}/icona-csc-pwa.svg`,
    `${PERCORSO}/manifest.json`
];

self.addEventListener("install", (ev) => {
    ev.waitUntil(
        (async () => {
            const cache = await caches.open(NOME_CACHE);
            cache.addAll(URLS);
        })()
    );
});

self.addEventListener("activate", (ev) => {
    ev.waitUntil(
        (async () => {
            const nomi = await caches.keys();
            await Promise.all(
                nomi.map((nome) => {
                    if (nome !== NOME_CACHE) {
                        return caches.delete(nome);
                    }
                })
            );
            await clients.claim();
        })()
    );
});

self.addEventListener("fetch", (ev) => {
    if (ev.request.mode === "navigate") {
        ev.respondWith(caches.match(`${PERCORSO}/`));
        return;
    }

    ev.respondWith(
        (async () => {
            const cache = await caches.open(NOME_CACHE);
            const rispostaCachata = await cache.match(ev.request.url);
            if (rispostaCachata) {
                return rispostaCachata;
            }
            return new Response(null, { status: 404 });
        })()
    );
});
