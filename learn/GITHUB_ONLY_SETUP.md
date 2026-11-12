# AMM Learning — GitHub-only content architecture

AMM Learning uses this repository as its content source of truth. The public library reads version-controlled JSON files and serves uploaded assets as static files.

## Content locations

- `learn/data/categories.json` — category names, descriptions, icons, order and active state.
- `learn/data/resources.json` — resource metadata, guide/prompt/code text, publication state, tags, links and category slugs.
- `learn/assets/uploads/` — uploaded PDFs, images, text/Markdown files and ZIP resources.
- `api/learn-admin.js` — server-side, password-protected publishing endpoint. GitHub credentials never reach the browser.

The public library, category pages and resource pages do not call the Supabase Data API or Supabase Storage.

## Vercel environment variables

Configure these in the Vercel project settings. Never put the GitHub token in frontend code, JSON files, GitHub commits or chat messages.

| Variable | Purpose |
| --- | --- |
| `AMM_LEARN_GITHUB_TOKEN` | Fine-grained GitHub token with access only to `wwwab229-cpu/amm-data-solutions-new` and **Contents: Read and write** permission. |
| `AMM_LEARN_ADMIN_PASSWORD` | A unique, strong password for the private Learning Manager. |
| `AMM_LEARN_GITHUB_BRANCH` | Optional branch override. Preview should use `feature/amm-learning-github-only`; Production should use `main`. If unset, the API uses `main`. |

Set the branch override only in the matching Vercel environment. Do not set the feature branch as the Production value after merging.

## Admin publishing

Open `/learn/manage/`, enter the admin password, and manage categories/resources. Every save creates a GitHub commit. Uploads are committed under `learn/assets/uploads/`.

Accepted file types: PDF, JPG/JPEG, PNG, WebP, TXT, Markdown and ZIP. Maximum size: 3 MB per file (Vercel request-body constraint for base64 uploads).

## Public repository visibility

This GitHub repository is public. Anything committed here—including draft resource text and metadata—is publicly accessible through GitHub even when the public Learning site filters it out. Do not store confidential information, private client files or sensitive drafts in this repository. Only publish content suitable for public access.

## Scope of the Supabase change

Supabase is removed from AMM Learning content/category reads and writes. Other AMM website features that separately use Supabase (for example, feedback workflows) are not changed by this migration.
