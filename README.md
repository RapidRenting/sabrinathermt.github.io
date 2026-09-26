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

## Search and website statistics

Google Search Console is configured for the domain `sabrinathermt.com`. The submitted
sitemap is `https://sabrinathermt.com/sitemap-index.xml`. On September 6, 2026,
Search Console reported a successful sitemap read on September 4 and 12 discovered
pages; the page-indexing report was still processing. Discovery does not guarantee
indexing. Review Performance for queries, impressions and clicks, and Pages for
indexing issues once data is available.

Cloudflare Web Analytics is configured in Sabrina's Cloudflare account. The
`WebAnalytics.astro` component loads its cookie-free beacon only on the canonical
production hostname, keeping local previews out of the reports. The site token is
public and is not an account credential. Both privacy pages describe the service.
The integration starts collecting only after these website changes are published.

Use Cloudflare's visits, page views, referrers and page performance alongside
Search Console's search queries and clicks. These reports do not measure completed
Jane appointments or identify patients. Review trends over several weeks rather
than drawing conclusions from the site's first few visits.

Search Console also flags an unused ownership token associated with a Google
temporary account. Do not remove the DNS verification record without checking
whether Google Workspace still depends on it.

## Services, pricing and headshot

The bilingual Services & pricing pages are linked from the main navigation and footer.
Appointment fees and service descriptions live in `src/components/ServicesPage.astro`.
The 30-minute option is request-only and cannot be booked online; keep that exception
aligned with the booking FAQ when editing appointment options.

The header uses the existing S mark and the wordmark from the supplied raster logo,
with the English brand slogan beneath it. Headshot setup for both Meet Sabrina
pages is documented in [docs/headshot.md](docs/headshot.md).

Shared colors live in `src/styles/global.css`: mulberry is the header and primary
action color, slate blue is the secondary color for links, outlined actions and
callouts. The same slate blue fills page introductions and pricing headings, with
cream text for contrast.

## FAQ editing

The FAQ content lives in `src/data/faqs.json`. Every entry requires a stable ID and complete English and French text. The editor at `/admin/` uses Decap CMS editorial workflow, so changes are reviewed through a pull request before they can reach the live site.

## Deployment

GitHub Actions builds and deploys `main` to GitHub Pages. The canonical domain is `https://sabrinathermt.com`.

The CMS OAuth Worker is configured in `worker/wrangler.jsonc`. Production deployment requires the `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` secrets in Cloudflare. Editor access is restricted to the lowercase GitHub usernames listed in `ALLOWED_GITHUB_USERS`; it currently includes `rapidrenting` and `sabrinathermt`.

## Content safeguards

- Do not add testimonials, ratings, superiority claims, guaranteed outcomes, implied specialties or CMTO branding.
- Do not collect personal health information through this website, ordinary email or text messages.
- Keep the English and French privacy pages and contact FAQs aligned with Sabrina's approved messaging practices.
- Keep live availability, booking policies and health-history collection in Jane; keep the published website fees aligned with Sabrina’s approved pricing.
- Sabrina must approve French healthcare and marketing wording before publication.
