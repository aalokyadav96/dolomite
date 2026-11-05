import { div, span, button, a } from '../../dom';
import { appStore, authActions } from '../../appState';
import { router } from '../../main';

export function createNavElement(): HTMLElement {
  const state = appStore.getState();

  const navChildren: (Node | string)[] = [
    a({ href: '/', 'data-link': '' }, 'Home')
  ];

  if (state.token) {
    navChildren.push(
      a({ href: '/profile', 'data-link': '' }, '👤 Profile'),
      a({ href: '/farms/1', 'data-link': '' }, 'Farm 1'),
      a({ href: '/farms/2', 'data-link': '' }, 'Farm 2')
    );

    if (state.roles.includes('admin')) {
      const adminLink = a({ href: '/admin/settings', 'data-link': '' }, '⚙️ Admin Panel');
      (adminLink as HTMLElement).style.fontWeight = 'bold';
      (adminLink as HTMLElement).style.color = '#dc2626';
      navChildren.push(adminLink);
    }

    navChildren.push(
      span({ style: 'margin-left: auto; font-weight: 500;' }, `Hello, ${state.handle || 'User'}`),
      button({
        onClick: () => {
          authActions.logout();
          router.navigate('/login');
        }
      }, 'Logout')
    );
  } else {
    navChildren.push(
      a({ href: '/login', 'data-link': '' }, 'Login'),
      a({ href: '/register', 'data-link': '' }, 'Register')
    );
  }

  return div({}, ...navChildren);
}