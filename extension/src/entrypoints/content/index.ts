import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';

const normaliseLinkedinUrl = (url: string): string => {
  const match = url.match(/https:\/\/www\.linkedin\.com\/in\/([^/?#]+)/);
  if (!match) return url;
  return `https://www.linkedin.com/in/${match[1]}`;
};

export default defineContentScript({
  matches: ['https://www.linkedin.com/in/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const linkedinUrl = normaliseLinkedinUrl(window.location.href);

    const ui = await createShadowRootUi(ctx, {
      name: 'linkedin-notes-panel',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(App, { linkedinUrl }));
        return root;
      },
    });

    ui.mount();
  },
});
