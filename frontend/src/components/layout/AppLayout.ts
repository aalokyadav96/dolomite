import { div, header, main, footer, h1, p } from '../ui/dom';
import { appStore } from '../../appState';
import { createNavElement } from './NavBar';

export function renderLayout(contentElement: HTMLElement): HTMLElement {
  const container = div({ className: 'app-shell' });

  const headerEl = header({ className: 'app-header' },
    div({ className: 'brand-block' },
      div({ className: 'brand-mark' }, 'D'),
      div({ className: 'brand-copy' },
        h1({}, 'Dolomite'),
        p({}, 'Farm operations dashboard')
      )
    )
  );

  const navWrap = div({ className: 'nav-shell' });
  const navEl = createNavElement();
  navWrap.appendChild(navEl);

  const mainEl = main({ className: 'app-main' }, contentElement);

  const footerEl = footer({ className: 'app-footer' },
    p({}, 'Dolomite © 2026'),
    p({}, 'Manage farms, crop records, and operational insights')
  );

  container.append(headerEl, navWrap, mainEl, footerEl);

  const unsubscribe = appStore.subscribe(() => {
    const newNav = createNavElement();
    navWrap.replaceChildren(newNav);
  });

  (container as any).__unsubscribe = unsubscribe;
  return container;
}