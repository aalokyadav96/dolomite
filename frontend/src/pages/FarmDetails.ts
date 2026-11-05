import { div, h2, p, span } from '../dom';
import { getFarmDetails } from '../services/farmServices';

export async function createFarmDetailsPage(farmID: string): Promise<HTMLElement> {
  const contentEl = div({}, 'Loading farm data from backend...');
  const card = div({ className: 'card' },
    h2({}, `Farm Details (ID: ${farmID})`),
    contentEl
  );

  // Fetch data asynchronously
  getFarmDetails(farmID)
    .then((data) => {
      contentEl.replaceChildren(
        p({}, span({ style: 'font-weight: bold;' }, 'Name: '), data.name),
        p({}, span({ style: 'font-weight: bold;' }, 'Crop: '), data.crop),
        p({}, span({ style: 'font-weight: bold;' }, 'Status: '), data.status)
      );
    })
    .catch((err: any) => {
      contentEl.replaceChildren(p({ className: 'error' }, `Failed to load: ${err.message}`));
    });

  return card;
}