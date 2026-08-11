# Sabrina The RMT

Professional bilingual static website for Sabrina McMorran, Registered Massage Therapist in Ottawa.

## Local development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Run all local checks with:

```sh
npm run format:check
npm test
npm run build
npm run worker:dry-run
```

After the production domain is connected, run the end-to-end launch verification with:

```sh
npm run verify:production
```

This checks the required GitHub Pages DNS records, preserved Google Workspace mail records, the retained GitHub verification challenge, HTTPS and `www` redirects, every bilingual canonical/alternate pair, robots and sitemaps, and all Jane booking destinations.

## FAQ editing

The FAQ content lives in `src/data/faqs.json`. Every entry requires a stable ID and complete English and French text. The editor at `/admin/` uses Decap CMS editorial workflow, so changes are reviewed through a pull request before they can reach the live site.

## Deployment

GitHub Actions builds and deploys `main` to GitHub Pages. The canonical domain is `https://sabrinathermt.com`.

The CMS OAuth Worker is configured in `worker/wrangler.jsonc`. Production deployment requires the `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` secrets in Cloudflare. Add Sabrina’s exact lowercase GitHub username to `ALLOWED_GITHUB_USERS` before the editor acceptance test.

## Content safeguards

- Do not add testimonials, ratings, superiority claims, guaranteed outcomes, implied specialties or CMTO branding.
- Do not collect personal health information through this website or ordinary email.
- Keep current availability, fees, booking policies and health-history collection in Jane.
- Sabrina must approve French healthcare and marketing wording before publication.
