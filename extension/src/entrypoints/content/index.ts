import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';

const normaliseLinkedinUrl = (url: string): string => {
  const match = url.match(/https:\/\/www\.linkedin\.com\/in\/([^/?#]+)/);
  if (!match) return url;
  return `https://www.linkedin.com/in/${match[1]}`;
};

const isProfileUrl = (url: string): boolean =>
  /https:\/\/www\.linkedin\.com\/in\/[^/?#]+/.test(url);

export type ScrapedProfileData = {
  name: string;
  jobTitle: string;
  company: string;
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

  // Job title — first <p> inside the company anchor within the Experience section
  const jobTitle =
    experienceSection?.querySelector('a[href*="linkedin.com/company/"] p')?.textContent?.trim() ?? '';

  // Company — second <p> in that same anchor, text before " ·" strips employment type (e.g. "· Full-time")
  const rawCompany =
    experienceSection?.querySelectorAll('a[href*="linkedin.com/company/"] p')[1]?.textContent?.trim() ?? '';
  const company = rawCompany.split(' ·')[0].trim();

  return { name, jobTitle, company };
};

export default defineContentScript({
  matches: ['https://www.linkedin.com/in/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let currentUrl = normaliseLinkedinUrl(window.location.href);

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

    ui.mount();

    // LinkedIn is a SPA — navigating between profiles does not trigger a full page
    // reload, so the content script's main() only runs once. A MutationObserver on
    // document.body detects DOM mutations that accompany each client-side navigation
    // and re-renders the App with the new URL when the profile changes.
    let activeUi = ui;

    const observer = new MutationObserver(() => {
      const newUrl = normaliseLinkedinUrl(window.location.href);
      if (newUrl !== currentUrl && isProfileUrl(window.location.href)) {
        currentUrl = newUrl;
        activeUi.remove();
        createShadowRootUi(ctx, {
          name: 'linkedin-notes-panel',
          position: 'inline',
          anchor: 'body',
          append: 'last',
          onMount(container) {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(App, { linkedinUrl: currentUrl }));
            return root;
          },
        }).then((newUi) => {
          activeUi = newUi;
          newUi.mount();
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    ctx.onInvalidated(() => observer.disconnect());
  },
});
