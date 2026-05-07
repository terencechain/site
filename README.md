# site

Personal site. Astro + minimal CSS. No frameworks, no JS.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # outputs to ./dist
```

## Editing content

- **About / links** — `src/pages/index.astro`
- **EIPs / projects** — `src/pages/work.astro` (edit the arrays at the top)
- **ethresear.ch posts** — `src/pages/writing.astro` (edit the array at the top)
- **Photos** — drop `.jpg`/`.png`/`.webp` into `src/photos/` (auto-listed)
- **Styling** — `src/styles/global.css`
- **Header / footer / nav** — `src/layouts/Layout.astro`

Search the repo for `YOUR_HANDLE` and replace with your GitHub / ethresear.ch handle.

## Deploy

Push to GitHub and connect the repo to **Cloudflare Pages** or **GitHub Pages**.
Build command: `bun run build`. Output dir: `dist`.
