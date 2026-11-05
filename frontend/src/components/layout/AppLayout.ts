import { div } from '../ui/dom';
import { appStore } from '../../appState';
import { createNavElement } from './NavBar';

export function renderLayout(contentElement: HTMLElement): HTMLElement {
  const container = div({});
  const navEl = createNavElement();
  container.append(navEl, contentElement);

  const unsubscribe = appStore.subscribe(() => {
    const newNav = createNavElement();
    navEl.replaceWith(newNav);
  });

  (container as any).__unsubscribe = unsubscribe;
  return container;
}