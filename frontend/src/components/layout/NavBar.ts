import { div, span, button, a } from '../ui/dom';
import { appStore, authActions } from '../../appState';
import { router } from '../../main';

export function createNavElement(): HTMLElement {
  const state = appStore.getState();

  const navChildren: (Node | string)[] = [
    a({ href: '/', 'data-link': '' }, 'Home')
  ];

  if (state.token) {
    navChildren.push(
      a({ href: '/profile', 'data-link': '' }, 'Profile'),
      a({ href: '/farms', 'data-link': '' }, 'Farms'),
      a({ href: '/crops', 'data-link': '' }, 'Crop Catalogue')
    );

    if (state.roles.includes('admin')) {
      const adminLink = a({ href: '/admin/settings', 'data-link': '' }, 'Admin');
      adminLink.classList.add('nav-admin-link');
      navChildren.push(adminLink);
    }

    navChildren.push(
      span({ className: 'nav-user-pill' }, `Hello, ${state.handle || 'User'}`),
      button({
        className: 'nav-logout',
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

  return div({ className: 'nav-bar' }, ...navChildren);
}