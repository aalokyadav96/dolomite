import { button, div, h1, h2, p, span } from '../components/ui/dom';
import { getCropCatalogueByType } from '../services/cropServices';

const CROP_TYPES = ['grains', 'vegetables', 'fruits', 'legumes'];

function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function createCropCataloguePage(selectedType?: string): Promise<HTMLElement> {
  const root = div({ className: 'card' }, h1({}, 'Crop Catalogue'));
  const tabBar = div({ className: 'tab-button-row', role: 'tablist', 'aria-label': 'Crop types' });
  const content = div({ className: 'tab-content-panel' });

  const activeKey = 'crop-catalogue-active-tab';
  const defaultType = CROP_TYPES.includes(selectedType || '') ? selectedType! : sessionStorage.getItem(activeKey) || CROP_TYPES[0];
  let activeTab = CROP_TYPES.includes(defaultType) ? defaultType : CROP_TYPES[0];

  const tabMap = new Map<string, HTMLButtonElement>();
  const panelMap = new Map<string, HTMLElement>();

  for (const cropType of CROP_TYPES) {
    const tabButton = button({
      type: 'button',
      role: 'tab',
      'aria-selected': cropType === activeTab ? 'true' : 'false',
      style: cropType === activeTab ? 'font-weight: 600; background: #dbeafe;' : '',
    }, titleCase(cropType));

    const panel = div({ className: 'tab-panel' }, p({}, 'Loading crop catalogue...'));
    tabMap.set(cropType, tabButton);
    panelMap.set(cropType, panel);

    tabButton.addEventListener('click', async () => {
      activeTab = cropType;
      sessionStorage.setItem(activeKey, cropType);
      renderTabs();
      await refreshPanel(cropType, panel);
    });

    tabBar.appendChild(tabButton);
    content.appendChild(panel);
  }

  root.appendChild(tabBar);
  root.appendChild(content);

  const renderTabs = () => {
    for (const [cropType, button] of tabMap.entries()) {
      const isActive = cropType === activeTab;
      button.setAttribute('aria-selected', String(isActive));
      button.style.fontWeight = isActive ? '600' : '400';
      button.style.background = isActive ? '#dbeafe' : '';
    }

    for (const [cropType, panel] of panelMap.entries()) {
      panel.style.display = cropType === activeTab ? 'block' : 'none';
    }
  };

  const refreshPanel = async (cropType: string, panel: HTMLElement) => {
    panel.replaceChildren(p({}, 'Loading crop catalogue...'));

    try {
      const crops = await getCropCatalogueByType(cropType);
      if (!crops.length) {
        panel.replaceChildren(p({}, `No crops available for ${titleCase(cropType)}.`));
        return;
      }

      const list = div({});
      for (const crop of crops) {
        const item = div({ style: 'border: 1px solid #e5e7eb; padding: 12px; margin-top: 8px;' },
          h2({}, crop.name),
          p({}, span({ style: 'font-weight: 600;' }, 'Type: '), crop.type),
          p({}, span({ style: 'font-weight: 600;' }, 'Water: '), crop.waterRequirement),
          p({}, crop.description)
        );
        list.appendChild(item);
      }
      panel.replaceChildren(list);
    } catch (err: any) {
      panel.replaceChildren(p({ className: 'error' }, `Unable to load ${titleCase(cropType)} catalogue: ${err.message}`));
    }
  };

  renderTabs();
  await refreshPanel(activeTab, panelMap.get(activeTab) || content);

  return root;
}
