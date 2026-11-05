# AMM Data Solutions — Search Discovery & Service-Page Validation
**Audit date:** 5 November 2026  
**Repository:** https://github.com/wwwab229-cpu/amm-data-solutions-new  
**Production URL:** https://amm-data-solutions-new.vercel.app/

## Scope and method
This is a source-level validation of the current GitHub default-branch files. It is not a live Google Search Console, Bing Webmaster Tools, Rich Results Test, or production HTTP verification. The browser inspection attempt could not retrieve the Vercel host in this audit session, so production deployment and live response codes remain unconfirmed.

## Confirmed source-level results
- `robots.txt` allows general crawling, explicitly allows `OAI-SearchBot`, disallows `/admin.html`, and references the XML sitemap.
- `sitemap.xml` contains 20 unique URL entries, including exactly seven dedicated service pages.
- All seven dedicated service pages are present in the sitemap and each source file has a self-referencing canonical URL matching its sitemap URL.
- All seven service pages have a non-empty title, meta description, one H1, and two JSON-LD script blocks.
- Every JSON-LD block on the seven service pages parsed as valid JSON in a local source check. Each page contains `Service` and `FAQPage` structured-data types.
- The homepage JSON-LD parsed as valid JSON and contains `Organization`, `WebSite`, `WebPage`, and `FAQPage`.
- `llms.txt` lists exactly seven services in the approved order and links to each service's canonical page.
- The homepage source contains Google Search Console and Bing Webmaster verification meta tags. This confirms the tags are present in source, not that either property currently reports verified ownership.

## Seven service-page source inventory

| # | Service | Canonical path | Structured data |
|---|---|---|---|
| 1 | AI Automation for Business & Everyday Work | `/services/ai-automation-business-everyday-work.html` | Service + FAQPage |
| 2 | Google SEO & AI Search Visibility | `/services/google-seo-ai-search-visibility.html` | Service + FAQPage |
| 3 | Digital Advertising | `/services/digital-advertising.html` | Service + FAQPage |
| 4 | AI Chatbots & Intelligent Agents | `/services/ai-chatbots-customer-support.html` | Service + FAQPage |
| 5 | Website Development & Improvement | `/services/website-development-improvement.html` | Service + FAQPage |
| 6 | Data Management & Data Entry | `/services/data-management-data-entry.html` | Service + FAQPage |
| 7 | Creative Design & Digital Content | `/services/creative-design-digital-content.html` | Service + FAQPage |

## Search-engine actions still requiring owner-console access
1. In Google Search Console, open the verified website property and inspect the homepage plus all seven canonical service URLs. Record the indexed status, selected canonical, last crawl date, and any exclusion reason. Use Live Test before requesting indexing for eligible URLs.
2. In the Search Console Sitemaps report, confirm that `https://amm-data-solutions-new.vercel.app/sitemap.xml` is submitted and successfully read. Record discovered URL count and any parsing errors.
3. In Bing Webmaster Tools, confirm site verification and sitemap ingestion. Review the IndexNow tab before implementing a new key or automation; avoid duplicate or unnecessary URL submissions.
4. Do not claim that a URL is indexed merely because it is listed in the sitemap or submitted for crawling.

## Recommended next implementation
- Validate the live production sitemap, robots file, llms file, canonical responses, redirects, and page status codes from an independent HTTP-capable environment.
- Run structured-data validation on the live homepage and all seven service pages; JSON parsing alone does not prove schema.org or rich-result eligibility.
- Review Google Search Console Page Indexing and Performance reports and Bing URL Inspection/Site Explorer data before changing page content.
- Keep the website's visual design unchanged. Prioritize only evidenced crawl, indexing, metadata, internal-link, and structured-data defects.

## Evidence limitations
No current ranking, impressions, clicks, indexing count, Google AI Overview appearance, ChatGPT recommendation, traffic growth, or lead growth was measured in this source audit.
