# Skills-CMS frontend

Astro SSG que pinta skills publicadas en Wagtail (repo hermano `ajcastrob/backend-cms`). Este archivo es la fuente de reglas para cualquier agente. `AGENTS.md` replica lo mismo.

El producto es un catálogo, no un dashboard. El lector no se autentica. El editor publica en `/blog/cms/` del backend.

## Stack (no cambiar sin que Alejandro lo pida)

- Astro 7, `output` estático (SSG). Sin adapter SSR.
- Vanilla JS en el código que escribimos (`src/lib/*.js`, frontmatter de páginas). No TypeScript nuevo. El `tsconfig` de Astro se deja.
- Tailwind 4 vía `@tailwindcss/vite` en `astro.config.mjs`. DaisyUI 5 con `@plugin "daisyui"` en `src/assets/app.css`.
- pnpm. Node `>=22.12`.
- Alias `@/*` → `src/*`.
- Iconos: `vite-plugin-supersvg` (devDependency). Plugin en `astro.config.mjs` junto a Tailwind.

## Iconos (supersvg)

Fuente: `src/icons/<grupo>/<nombre>.svg`. El plugin genera un sprite por carpeta en `public/assets/icons/<grupo>.svg`.

Uso (HTML, sin JS):

`<svg><use href="/assets/icons/logo.svg#logo" /></svg>`

El `#id` es el nombre del archivo sin `.svg`. El path del sprite es el nombre de la carpeta.

- No edites `public/assets/icons/` a mano. Se regenera al cambiar `src/icons/` (dev/build).
- Prefiere `fill="currentColor"` / `stroke="currentColor"` en el SVG para pintar con CSS `color`.
- No uses librerías de iconos React. Baja SVG (p. ej. icones.js.org) a `src/icons/`.
- Ya hay `src/icons/logo/logo.svg` → sprite `logo`, símbolo `#logo`.

## Datos

Hoy el front se arma contra mock. La forma del JSON **es** la de Wagtail API v2.

- Mock: `src/data/posts.json` (`meta.total_count` + `items`).
- Cliente: `src/lib/wagtail.js`.
- `getBlogPost()` **siempre** devuelve un array (los `items`). Nunca el objeto `{ meta, items }`.
- `getBlogPostBySlug(slug)` busca `item.meta.slug` (puede llevar tildes: `título-de-prueba`). No existe `item.slug`.
- Mientras haya mock: importar el JSON. No fetch.
- Cuando se vuelva a la API: `PUBLIC_WAGTAIL_API` (ej. `http://127.0.0.1:8000/api/v2`). Listado: `GET {base}/pages/?type=skills_blog.ArticlePage&fields=*`. Sin `?type=` no vienen intro/tags.
- `.env` no se commitea. Sí `.env.example`.
- No uses `meta.html_url` para navegar. Las URLs públicas las define Astro (`/skills/${slug}`).
- `image.meta.download_url` es relativa al origin de Wagtail, no al de Astro. Prefija `http://127.0.0.1:8000` o usa placeholder si Wagtail no está.

Campos de un item: `id`, `title`, `intro`, `body`, `date`, `caption`, `repo_url`, `tags`, `meta.slug`, `image`. `repo_url` vacío: no pintes el enlace. `body` es HTML de RichText.

## Rutas

| Archivo | URL |
| --- | --- |
| `src/pages/index.astro` | `/` últimos N (title, intro, link) |
| `src/pages/skills/index.astro` | `/skills/` listado |
| `src/pages/skills/[slug].astro` | `/skills/:slug` + `getStaticPaths` |

Layout: `src/layouts/Layout.astro` (html, nav Home / Skills, slot). Las páginas lo usan.

`getStaticPaths`: por cada post `{ params: { slug: post.meta.slug }, props: { post } }`.

`set:html` solo en `body`. Nunca en title, intro, tags o caption.

## Cómo trabajar

- Alejandro escribe el código. El agente guía (pasos, Listo/Verifica). No soltar el archivo entero salvo que pida "Haz" / "Aplica" / "agrega a AGENTS.md".
- Un corte a la vez: mock y estructura de páginas primero. Reconectar fetch después, sin cambiar las páginas si el return sigue siendo un array.
- No añadir React/Vue/Svelte, auth de lectores, fetch en el browser, ni preview de drafts.
- No commitear `.env`, `.DS_Store`, `node_modules`, `dist`.
- Commits: emoji + tipo, como el backend (`✨ feat: ...`).

## Dev

Wagtail (`runserver` en el backend) solo hace falta cuando el módulo vuelva a hacer fetch. Con mock, `pnpm dev` basta.

```
pnpm dev
pnpm build
```

Si otro agente arranca el server en background:

```
astro dev --background
astro dev stop
astro dev status
astro dev logs
```

## Docs

- Astro: https://docs.astro.build
- Rutas dinámicas: https://docs.astro.build/en/guides/routing/
- Wagtail API usage: https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html
- Cuaderno Obsidian del proyecto: `02-Proyectos/Skills-CMS/` (`Frontend`, `Arquitectura`, `Backend`)
