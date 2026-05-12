import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import ImportBanner from '../../components/ImportBanner';
import normaliseLinkedinUrl from '../../../../shared/utils/normaliseLinkedinUrl';

const isProfileUrl = (url: string): boolean =>
  /https:\/\/www\.linkedin\.com\/in\/[^/?#]+/.test(url);

const isConnectionsPage = (url: string): boolean =>
  url.includes('/mynetwork/invite-connect/connections');

export type ScrapedProfileData = {
  name: string;
  jobTitle: string;
  company: string;
  avatarUrl: string;
};

// Reads the LinkedIn profile DOM at call time. Returns empty strings for any
// field that can't be found — never throws.
export const scrapeProfileData = (): ScrapedProfileData => {
  // The profile name sits in an h2 inside the anchor that links to the profile URL
  const name =
    document.querySelector('a[href*="linkedin.com/in/"] h2')?.textContent?.trim() ?? '';

  // Scope job title and company to the Experience section — other parts of the page
  // share the same DOM structure, so we anchor to the stable componentkey attribute
  const experienceSection = document.querySelector('[componentkey*="ExperienceTopLevelSection"]');

  // Two layouts exist depending on whether the person has multiple roles at the same company:
  //
  // Single-role layout: company anchor contains [jobTitle, companyName] as consecutive <p> elements
  //
  // Multi-role layout: company anchor contains [companyName, "Full-time · duration"] at the top level,
  // followed by a <ul> of individual roles — each <li> anchor contains [jobTitle, dateRange].
  // Detected by the presence of a <ul> sibling after the first company anchor.
  // Matches both company and school employer links.
  // The first anchor is always a logo-only link with no <p> elements — skip it and use
  // the first anchor that actually contains text <p> elements as the top-level org anchor.
  const orgSelector = 'a[href*="linkedin.com/company/"], a[href*="linkedin.com/school/"]';
  const allOrgAnchors = [...(experienceSection?.querySelectorAll(orgSelector) ?? [])];
  const firstOrgAnchor = allOrgAnchors.find((a) => a.querySelector('p')) ?? null;
  const hasMultipleRoles = !!firstOrgAnchor?.closest('div')?.querySelector('ul');

  let jobTitle = '';
  let company = '';

  if (hasMultipleRoles) {
    // Org name is the first <p> in the top-level org anchor
    company = firstOrgAnchor?.querySelector('p')?.textContent?.trim() ?? '';
    // Job title is the first <p> in the first <li>'s anchor (most recent role)
    jobTitle = firstOrgAnchor?.closest('div')
      ?.querySelector(`ul li ${orgSelector}`)
      ?.querySelector('p')
      ?.textContent?.trim() ?? '';
  } else {
    // Single-role: first <p> is job title, second <p> is "OrgName · employment type"
    jobTitle = firstOrgAnchor?.querySelector('p')?.textContent?.trim() ?? '';
    const rawCompany =
      firstOrgAnchor?.querySelectorAll('p')[1]?.textContent?.trim() ?? '';
    company = rawCompany.split(' ·')[0].trim();
  }

  // Profile photo — the top-card photo container has a stable aria-label="Profile photo"
  const avatarUrl =
    document.querySelector('[aria-label="Profile photo"] img')?.getAttribute('src') ?? '';

  return { name, jobTitle, company, avatarUrl };
};

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let currentUrl = '';
    let activeUi: { remove: () => void } | null = null;

    const handleNavigation = async () => {
      if (ctx.isInvalid) return;

      const href = window.location.href;
      const normalised = normaliseLinkedinUrl(href);

      if (normalised === currentUrl) return;
      currentUrl = normalised;

      activeUi?.remove();
      activeUi = null;

      if (isConnectionsPage(href)) {
        const ui = await createShadowRootUi(ctx, {
          name: 'linkedin-notes-import-banner',
          position: 'inline',
          anchor: 'body',
          append: 'last',
          onMount(container) {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(ImportBanner));
            return root;
          },
        });
        if (ctx.isInvalid) return;
        ui.mount();
        activeUi = ui;
      } else if (isProfileUrl(href)) {
        const ui = await createShadowRootUi(ctx, {
          name: 'linkedin-notes-panel',
          position: 'inline',
          anchor: 'body',
          append: 'last',
          onMount(container) {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(App, { linkedinUrl: currentUrl, scrapeProfileData }));
            return root;
          },
        });
        if (ctx.isInvalid) return;
        ui.mount();
        activeUi = ui;
      }
      // Any other LinkedIn page — nothing mounted
    };

    window.addEventListener('popstate', handleNavigation);

    // MutationObserver watches for DOM changes that accompany each SPA navigation.
    // Debounced to collapse the burst of mutations per navigation into a single check.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (ctx.isInvalid) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleNavigation, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    handleNavigation();

    ctx.onInvalidated(() => {
      window.removeEventListener('popstate', handleNavigation);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      activeUi?.remove();
    });
  },
});
