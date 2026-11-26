const { chromium } = require('playwright');

const base = process.env.BASE_URL || 'https://amm-data-solutions-new.vercel.app';
const routes = [
  '/',
  '/admin.html',
  '/feedback.html',
  '/privacy.html',
  '/site-map.html',
  '/services/ai-automation-business-everyday-work.html',
  '/services/google-seo-ai-search-visibility.html',
  '/services/digital-advertising.html',
  '/services/ai-chatbots-customer-support.html',
  '/services/website-development-improvement.html',
  '/services/data-management-data-entry.html',
  '/services/creative-design-digital-content.html',
  '/services/pricing-and-quotes.html',
  '/resources/business-workflow-automation-guide.html',
  '/resources/small-business-digital-design-assets-guide.html',
  '/resources/business-website-chatbot-guide.html',
  '/resources/website-search-visibility-seo-ai-guide.html',
  '/resources/digital-advertising-campaign-planning-guide.html',
  '/resources/small-business-website-planning-guide.html',
  '/resources/spreadsheet-data-cleaning-management-guide.html',
  '/blog/',
  '/blog/ai-automation-for-modern-businesses.html',
  '/blog/website-chatbot-vs-contact-form.html',
];
const viewports = [
  { name: 'mobile-320', width: 320, height: 740, isMobile: true, hasTouch: true },
  { name: 'mobile-360', width: 360, height: 800, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'laptop-1024', width: 1024, height: 768, isMobile: false, hasTouch: false },
  { name: 'desktop-1365', width: 1365, height: 900, isMobile: false, hasTouch: false },
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: 'wide-desktop-1920', width: 1920, height: 1080, isMobile: false, hasTouch: false },
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
        const onPageError = error => errors.push(`${error.message} :: ${error.stack?.split('\n').slice(0, 3).join(' | ') || ''}`);
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
          // The approved mobile header keeps "Get in touch" outside the hamburger menu.
          // Do not add it to the menu; verify the menu opens and closes accessibly instead.
          const contactLinkInMenu = page.locator('#menu a[href="#business-cta"]');
          if (await contactLinkInMenu.count()) {
            failures.push('[mobile] Get in touch was unexpectedly placed inside the mobile menu');
          }
          await burger.click();
          if (await burger.getAttribute('aria-expanded') !== 'false' || await burger.getAttribute('aria-label') !== 'Open menu') {
            failures.push(`[${viewport.name}] mobile menu did not close with the expected accessible state`);
          } else {
            console.log('[mobile] menu open/close state: OK; contact CTA remains outside menu');
          }
        } else {
          failures.push('[mobile] Could not find the mobile menu button');
        }
      }
      // Ensure every viewport tests the same homepage controls after the route sweep.
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });
      // The approved homepage CTA navigates to the dedicated feedback portal.
      // Test that public flow and its controls without submitting production data.
      const feedbackLink = page.locator('#open-feedback');
      if (await feedbackLink.count()) {
        const feedbackHref = await feedbackLink.getAttribute('href');
        if (feedbackHref !== '/feedback.html') failures.push(`[${viewport.name}] feedback CTA destination is incorrect: ${feedbackHref}`);
        await page.goto(base + '/feedback.html', { waitUntil: 'networkidle', timeout: 30000 });
        const feedbackForm = page.locator('#feedbackForm');
        if (!(await feedbackForm.isVisible())) {
          failures.push(`[${viewport.name}] dedicated feedback form did not render`);
        } else {
          const serviceField = page.locator('#service');
          const messageField = page.locator('#message');
          const submitButton = page.locator('#submitButton');
          if (!(await serviceField.isVisible()) || !(await messageField.isVisible()) || !(await submitButton.isVisible())) {
            failures.push(`[${viewport.name}] feedback form is missing a required visible control`);
          }
          const thirdStar = page.locator('.star[data-rating="3"]');
          if (await thirdStar.count()) {
            await thirdStar.click();
            const ratingState = await page.locator('.star').evaluateAll(nodes => nodes.map(n => ({ rating: n.dataset.rating, pressed: n.getAttribute('aria-pressed') })));
            if (ratingState.filter(x => x.pressed === 'true').length !== 3 || ratingState[2]?.pressed !== 'true') {
              failures.push(`[${viewport.name}] dedicated feedback rating did not select three stars`);
            } else {
              console.log(`[${viewport.name}] dedicated feedback page + rating controls: OK`);
            }
          } else {
            failures.push(`[${viewport.name}] dedicated feedback star controls not found`);
          }
        }
      } else {
        failures.push(`[${viewport.name}] homepage feedback CTA not found`);
      }
      // Restore the homepage after checking the separate feedback route.
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });

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

