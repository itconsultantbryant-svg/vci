# Vivacious Consultants, Inc.

## JavaScript application
The site is a JavaScript-rendered, single-page application. `index.html` is only the required browser mount point; all page content, routes, interactions, and reusable UI are created in `client.js`. The zero-dependency JavaScript server in `scripts/dev-server.js` supports clean, shareable paths.

## Run locally
```sh
npm start
```
Open `http://localhost:4173`. Clean routes include `/about`, `/communications`, `/media-pr`, `/business-innovation`, `/monitoring-evaluation`, `/smart-techs`, `/clients`, `/team`, `/policies`, and `/contact`.

## Content
Reusable content and page copy are held in `client.js` (`services`, hero slides, and page components). Replace approved client and team placeholders only with authorized information. The supplied logo remains in `assets/`.

## Contact form setup
The form validates browser input but deliberately does not simulate email delivery. To enable delivery, add a server-side endpoint that validates and rate-limits submissions, sends through a configured provider using environment variables, uses a verified sender address, and sets the visitor email as Reply-To. Do not expose credentials in client code. Update the draft privacy and cookie disclosures to match the chosen provider, analytics, cookies, and retention practices.

## Deployment
Deploy the JavaScript server to a Node-compatible HTTPS host, or configure an SPA fallback to `index.html` on a static host. Add a server-side contact endpoint before enabling form delivery.
# vci
