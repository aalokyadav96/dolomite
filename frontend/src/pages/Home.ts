import { div, h1, p } from '../dom';

export function createHomePage(): HTMLElement {
  return div({ className: 'card' },
    h1({}, 'TypeScript SPA Dashboard'),
    p({}, 'Vanilla TypeScript SPA with Vite, History API routing, functional state management, and RBAC guards.')
  );
}