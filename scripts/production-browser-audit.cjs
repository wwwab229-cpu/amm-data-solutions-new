const { chromium } = require('playwright');

const base = 'https://amm-data-solutions-new.vercel.app';
const routes = [
  '/',
  '/admin.html',
  '/privacy.html',
  '/services/ai-business-automation.html',
  '/services/ai-chatbots-customer-support.html',
  '/services/google-seo-ai-search-visibility.html',
  '/services/digital-advertising.html',
  '/services/website-design-digital-solutions.html',
  '/services/data-management-data-entry.html',
];
const viewports = [
  { name: 'mobile-320', width: 320, height: 740, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'desktop-1365', width: 1365, height: 900, isMobile: false, hasTouch: false },
];
const failures = [];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        hasTouch: viewport.hasTouch,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);

      for (const route of routes) {
        const errors = [];
        const onPageError = error => errors.push(error.message);
        page.on('pageerror', onPageError);
        const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 }).catch(async error => {
          failures.push(`[${viewport.name}] ${route}: navigation failed: ${error.message}`);
          return null;
        });
        if (!response) {
          page.off('pageerror', onPageError);
          continue;
        }

        const status = response.status();
        const result = await page.evaluate(() => ({
          title: document.title.trim(),
          h1Count: document.querySelectorAll('h1').length,
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          missingImageAlt: [...document.images].filter(img => !img.hasAttribute('alt')).length,
          canonical: Boolean(document.querySelector('link[rel="canonical"][href]')),
          description: Boolean(document.querySelector('meta[name="description"][content]')),
          bodyText: (document.body?.innerText || '').trim().length,
        }));

        if (status !== 200) failures.push(`[${viewport.name}] ${route}: HTTP ${status}`);
        if (!result.title) failures.push(`[${viewport.name}] ${route}: missing document title`);
        const expectedH1 = route === '/admin.html' ? 2 : 1;
        if (result.h1Count !== expectedH1) failures.push(`[${viewport.name}] ${route}: expected ${expectedH1} H1(s), found ${result.h1Count}`);
        if (result.documentWidth > result.viewportWidth + 1) failures.push(`[${viewport.name}] ${route}: horizontal overflow (${result.documentWidth}px > ${result.viewportWidth}px)`);
        if (result.missingImageAlt > 0) failures.push(`[${viewport.name}] ${route}: ${result.missingImageAlt} image(s) missing alt attribute`);
        if (!result.bodyText) failures.push(`[${viewport.name}] ${route}: body text is empty`);
        if (route.startsWith('/services/') && (!result.canonical || !result.description)) {
          failures.push(`[${viewport.name}] ${route}: missing canonical URL or meta description`);
        }
        for (const error of errors) failures.push(`[${viewport.name}] ${route}: uncaught page error: ${error}`);

        console.log(`[${viewport.name}] ${route} -> HTTP ${status}; ${result.viewportWidth}px viewport; ${result.documentWidth}px document; H1=${result.h1Count}`);
        page.off('pageerror', onPageError);
      }

      if (viewport.width < 768) {
        await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });
        const burger = page.locator('#burger');
        if (await burger.count()) {
          await burger.click();
          if (await burger.getAttribute('aria-expanded') !== 'true' || await burger.getAttribute('aria-label') !== 'Close menu') {
            failures.push(`[${viewport.name}] mobile menu open state or accessible label is incorrect`);
          }
          const contactLink = page.locator('#menu a[href="#business-cta"]');
          if (await contactLink.count()) {
            await contactLink.click();
            if (await burger.getAttribute('aria-expanded') !== 'false' || await burger.getAttribute('aria-label') !== 'Open menu') {
              failures.push(`[${viewport.name}] mobile menu state did not reset after navigation`);
            }
            await page.waitForFunction(() => {
              const target = document.getElementById('business-cta');
              if (!target) return false;
              const rect = target.getBoundingClientRect();
              return rect.top < window.innerHeight && rect.bottom > 0;
            }, { timeout: 5000 }).catch(() => {});
            const reachedTarget = await page.evaluate(() => {
              const target = document.getElementById('business-cta');
              if (!target) return false;
              const rect = target.getBoundingClientRect();
              return rect.top < window.innerHeight && rect.bottom > 0;
            });
            if (!reachedTarget) failures.push('[mobile] Get in touch link did not bring the business contact section into view');
            else console.log('[mobile] Get in touch -> business contact section: OK');
          } else {
            failures.push('[mobile] Could not find the mobile Get in touch link');
          }
        } else {
          failures.push('[mobile] Could not find the mobile menu button');
        }
      }
      // Exercise the feedback controls without submitting or creating production records.
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });
      const openFeedback = page.locator('#open-feedback');
      if (await openFeedback.count()) {
        await openFeedback.click();
        const panel = page.locator('#feedback-panel');
        const panelVisible = await panel.isVisible();
        if (!panelVisible) failures.push(`[${viewport.name}] feedback form did not open`);
        const thirdStar = page.locator('#feedback-stars .feedback-star[data-rating="3"]');
        if (await thirdStar.count()) {
          await thirdStar.click();
          const ratingState = await page.locator('#feedback-stars .feedback-star').evaluateAll(nodes => nodes.map(n => ({ rating: n.dataset.rating, checked: n.getAttribute('aria-checked'), filled: n.classList.contains('is-filled') })));
          if (ratingState.filter(x => x.checked === 'true').length !== 1 || ratingState.filter(x => x.filled).length !== 3 || ratingState[2]?.checked !== 'true') {
            failures.push(`[${viewport.name}] feedback star selection did not set cumulative three-star rating correctly`);
          } else {
            console.log(`[${viewport.name}] feedback form open + 3-star selection: OK`);
          }
        } else {
          failures.push(`[${viewport.name}] feedback star controls not found`);
        }
        const positivePill = page.locator('#feedback-positive .feedback-pill').first();
        if (await positivePill.count()) {
          await positivePill.click();
          const reviewText = await page.locator('#feedback-review').inputValue();
          if (!reviewText.trim()) failures.push(`[${viewport.name}] feedback suggestion did not populate the message field`);
          else console.log(`[${viewport.name}] feedback suggestion pill: OK`);
        }
        await page.locator('#close-feedback').click();
        if (await panel.isVisible()) failures.push(`[${viewport.name}] feedback form did not close`);
      } else {
        failures.push(`[${viewport.name}] feedback open button not found`);
      }

      // Check the service-details overlay fits and closes cleanly on each viewport.
      const firstService = page.locator('#work [data-service-index="0"]');
      if (await firstService.count()) {
        await firstService.click();
        const overlay = page.locator('.amm-service-overlay');
        const visible = await overlay.isVisible().catch(() => false);
        if (!visible) {
          failures.push(`[${viewport.name}] service details overlay did not open`);
        } else {
          const bounds = await page.locator('.amm-service-dialog').evaluate(el => {
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height, vw: innerWidth, vh: innerHeight };
          });
          if (bounds.left < -1 || bounds.right > bounds.vw + 1 || bounds.top < -1 || bounds.bottom > bounds.vh + 1) {
            failures.push(`[${viewport.name}] service dialog exceeds viewport bounds: ${JSON.stringify(bounds)}`);
          } else {
            console.log(`[${viewport.name}] service details dialog fits viewport: OK`);
          }
          await page.locator('.amm-service-close').click();
          await page.waitForTimeout(450);
          if (await overlay.isVisible().catch(() => false)) failures.push(`[${viewport.name}] service details overlay did not close`);
        }
      } else {
        failures.push(`[${viewport.name}] service card not found for overlay test`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error('\nBrowser audit failures:');
    for (const failure of failures) console.error(' - ' + failure);
    process.exitCode = 1;
  } else {
    console.log('\nBrowser audit passed for all pages at 320px, 390px, 768px and 1365px viewports.');
  }
})();
