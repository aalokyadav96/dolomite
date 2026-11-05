import { button, div, form, h1, h2, input, label, p, span } from '../components/ui/dom';
import { router } from '../main';
import { addCropToFarm, createFarm, deleteFarm, listFarms, removeCropFromFarm } from '../services/farmServices';

export async function createHomePage(): Promise<HTMLElement> {
  const root = div({ className: 'card' },
    h1({}, 'Farm Dashboard'),
    p({}, 'Manage farms and crop records from the API.')
  );

  const createForm = form({
    onSubmit: async (event: Event) => {
      event.preventDefault();
      const formEl = event.currentTarget as HTMLFormElement;
      const formData = new FormData(formEl);

      const farmName = String(formData.get('name') || '').trim();
      const cropName = String(formData.get('crop') || '').trim();
      const status = String(formData.get('status') || 'Healthy').trim();

      if (!farmName) {
        window.alert('Farm name is required');
        return;
      }

      try {
        await createFarm({ name: farmName, crop: cropName, status });
        formEl.reset();
        await refreshList();
      } catch (err: any) {
        window.alert(err.message || 'Unable to create farm');
      }
    },
    style: 'margin-bottom: 20px;'
  },
    label({}, 'Farm Name'),
    input({ name: 'name', type: 'text', required: true }),
    label({}, 'Primary Crop'),
    input({ name: 'crop', type: 'text' }),
    label({}, 'Status'),
    input({ name: 'status', type: 'text', value: 'Healthy' }),
    button({ type: 'submit' }, 'Create Farm')
  );

  root.appendChild(createForm);

  const listContainer = div({ className: 'farm-list' });
  root.appendChild(listContainer);

  await refreshList();

  async function refreshList() {
    listContainer.replaceChildren();

    try {
      const farms = await listFarms();
      if (!farms.length) {
        listContainer.appendChild(p({}, 'No farms found.'));
        return;
      }

      for (const farm of farms) {
        const cropList = div({ className: 'crop-list' });
        const crops = farm.crops && farm.crops.length ? farm.crops : [farm.crop].filter(Boolean);
        crops.forEach((crop) => {
          const item = div({}, span({}, crop));
          const removeBtn = button({ type: 'button' }, 'Remove');
          removeBtn.addEventListener('click', async () => {
            try {
              await removeCropFromFarm(farm.id, crop);
              await refreshList();
            } catch (err: any) {
              window.alert(err.message || 'Unable to remove crop');
            }
          });
          item.appendChild(removeBtn);
          cropList.appendChild(item);
        });

        const cropForm = form({
          onSubmit: async (event: Event) => {
            event.preventDefault();
            const formEl = event.currentTarget as HTMLFormElement;
            const value = String(new FormData(formEl).get('cropName') || '').trim();
            if (!value) {
              return;
            }
            try {
              await addCropToFarm(farm.id, value);
              formEl.reset();
              await refreshList();
            } catch (err: any) {
              window.alert(err.message || 'Unable to add crop');
            }
          }
        },
          input({ name: 'cropName', type: 'text', placeholder: 'Add crop' }),
          button({ type: 'submit' }, 'Add Crop')
        );

        const card = div({ className: 'farm-item', style: 'border: 1px solid #ddd; padding: 12px; margin-top: 12px;' },
          h2({}, farm.name),
          p({}, `Status: ${farm.status}`),
          p({}, `Primary Crop: ${farm.crop || 'N/A'}`),
          cropList,
          cropForm
        );

        const viewBtn = button({ type: 'button', style: 'margin-right: 8px;' }, 'View Details');
        viewBtn.addEventListener('click', () => router.navigate(`/farms/${farm.id}`));
        card.appendChild(viewBtn);

        const deleteBtn = button({ type: 'button', style: 'margin-left: 8px;' }, 'Delete Farm');
        deleteBtn.addEventListener('click', async () => {
          if (!window.confirm(`Delete ${farm.name}?`)) {
            return;
          }
          try {
            await deleteFarm(farm.id);
            await refreshList();
          } catch (err: any) {
            window.alert(err.message || 'Unable to delete farm');
          }
        });
        card.appendChild(deleteBtn);
        listContainer.appendChild(card);
      }
    } catch (err: any) {
      listContainer.replaceChildren(p({ className: 'error' }, err.message || 'Failed to load farms'));
    }
  }

  return root;
}