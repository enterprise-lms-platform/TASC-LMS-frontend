/**
 * Vitest global test setup
 * - Extends expect with @testing-library/jest-dom matchers
 * - Patches window.matchMedia (jsdom doesn't implement it)
 * - Patches window.scrollTo (jsdom doesn't implement it)
 */

import '@testing-library/jest-dom';

// jsdom does not implement matchMedia — MUI and several hooks call it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement scrollTo
window.scrollTo = () => {};
