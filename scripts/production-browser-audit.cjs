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
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1365, height: 900, isMobile: false, hasTouch: false },
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

      if (viewport.name === 'mobile') {
        await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });
        const burger = page.locator('#burger');
        if (await burger.count()) {
          await burger.click();
          const contactLink = page.locator('#menu a[href="#business-cta"]');
          if (await contactLink.count()) {
            await contactLink.click();
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
    console.log('\nBrowser audit passed for all pages at mobile and desktop viewports.');
  }
})();
