# Infinity Build Smart

Website for **M/s. Infinity Construction & Developers** — a construction and development firm based in Belagavi, India, offering residential, commercial, and mixed-use construction, architectural design, project management, and interior services. Motto: *Build Safe, Build Smart.*

A static HTML/CSS/JS site — no build step or framework required.

## Project structure

```
.
├── index.html      # Main page (hero, about, services, projects, team, contact)
├── css/
│   └── style.css   # All styles
├── js/
│   └── main.js     # Nav toggle, scroll header, stat counters, contact form handling
├── images/         # Local image assets (currently empty — gallery/logo are hotlinked, see below)
├── CNAME           # Custom domain for GitHub Pages
└── LICENSE         # MIT License
```

> Note: fonts are loaded from Google Fonts (CDN), and gallery/logo images currently reference Hostinger's asset CDN. There are no local `fonts/` or `assets/` folders yet since no local font or asset files exist — add them here and update the references in `index.html`/`css/style.css` if you want everything self-hosted.

## Local development

No build tools needed. From the project root, serve the folder with any static server, for example:

```bash
python -m http.server 5173
```

Then open http://localhost:5173 in your browser.

## Deployment

This repo is deployed via **GitHub Pages**, building from the `main` branch, root (`/`) folder.

- GitHub Pages URL: https://shrikant0003.github.io/infinitybuildsmart/
- Custom domain: [infinitybuildsmart.com](https://infinitybuildsmart.com) (configured via the `CNAME` file + DNS records on the domain registrar/host)

## Custom domain DNS (Hostinger)

Point `infinitybuildsmart.com` at GitHub Pages using these DNS records in Hostinger:

**A records** (apex domain `@`):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME record** (`www` subdomain):
```
www -> shrikant0003.github.io
```

## License

MIT — see [LICENSE](LICENSE).
