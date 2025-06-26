const CACHE_NAME = "pokemon-pokedex-v1";
const GRAPHQL_CACHE = "graphql-cache-v1";
const IMAGE_CACHE = "image-cache-v1";

// GraphQL requests to cache
const GRAPHQL_ENDPOINTS = ["/graphql"];

// Image URLs to cache
const IMAGE_PATTERNS = [
  /raw\.githubusercontent\.com.*sprites/,
  /assets\.pokemon\.com/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.json", "/favicon.ico"]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache GraphQL requests
  if (
    request.method === "POST" &&
    GRAPHQL_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))
  ) {
    event.respondWith(
      caches.open(GRAPHQL_CACHE).then(async (cache) => {
        const cacheKey = `${request.url}-${JSON.stringify(await request.clone().json())}`;
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
          return cachedResponse;
        }

        const response = await fetch(request);
        if (response.ok) {
          cache.put(cacheKey, response.clone());
        }
        return response;
      }),
    );
    return;
  }

  // Cache images
  if (IMAGE_PATTERNS.some((pattern) => pattern.test(request.url))) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      }),
    );
    return;
  }

  // Default handling
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    }),
  );
});
