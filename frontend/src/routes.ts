import { createRouter } from './router';
import { renderLayout } from './components/layout/AppLayout';

import { createHomePage } from './pages/Home';
import { createLoginPage } from './pages/Login';
import { createRegisterPage } from './pages/Register';
import { createProfilePage } from './pages/Profile';
import { createFarmDetailsPage } from './pages/FarmDetails';
import { createAdminSettingsPage } from './pages/AdminSettings';
import { createUnauthorizedPage } from './pages/Unauthorized';
import { createNotFoundPage } from './pages/NotFound';

export function setupRouter() {
  const router = createRouter();
  const app = document.getElementById('app')!;

  const wrap = (el: HTMLElement) => app.replaceChildren(renderLayout(el));

  router.add('/', () => wrap(createHomePage()));
  router.add('/login', () => wrap(createLoginPage()));
  router.add('/register', () => wrap(createRegisterPage()));
  
  router.add('/profile', () => wrap(createProfilePage()), true, ['user', 'admin']);
  
  router.add('/farms/:farmID', async (params) => {
    // Lazy loading or async page component rendering
    const pageEl = await createFarmDetailsPage(params.farmID);
    wrap(pageEl);
  }, true, ['user', 'admin']);

  router.add('/admin/settings', () => wrap(createAdminSettingsPage()), true, ['admin']);
  router.add('/unauthorized', () => wrap(createUnauthorizedPage()));
  router.add('/404', () => wrap(createNotFoundPage())); // Optional fallback rule if needed

  return router;
}