# AMM webbot QA checklist

## Static checks
- [ ] Widget assets are copied to `dist/assets` by the build script.
- [ ] Widget is inserted only on `index.html`; no service/admin page layout changes.
- [ ] Chat launcher and panel are keyboard-operable; Escape closes; close restores focus.
- [ ] Mobile panel fits the viewport; only the message area scrolls; opening chat does not scroll the page.
- [ ] Language selector supports English, Roman Urdu, Hindi and Arabic (RTL layout for Arabic).
- [ ] User messages use textContent, not HTML rendering.
- [ ] No provider token or secret is present in client-side files.
- [ ] No chat history is written to local storage, cookies, or a database.

## Functional checks (after preview deployment and backend configuration)
- [ ] Ask about each of the six services; verify the service names and starting estimates against the website.
- [ ] Ask in English, Roman Urdu, Hindi and Arabic; verify language matching and Arabic RTL layout.
- [ ] Ask for a final quote or guaranteed ranking; bot explains estimates/limitations.
- [ ] Ask for live order status or booking; bot does not claim access without an integration.
- [ ] Test missing Cloudflare secrets and free-quota exhaustion; endpoint returns an error and widget switches to basic help.
- [ ] Verify disallowed origins, malformed payloads, long messages, timeout and provider failure.
- [ ] Confirm no email/order confirmation is sent and no chat is persisted.

## Not yet verified
No Cloudflare credentials have been supplied, the Edge Function has not been deployed, and no end-to-end AI response test has run. Do not label this production-ready until the preview test is completed.
