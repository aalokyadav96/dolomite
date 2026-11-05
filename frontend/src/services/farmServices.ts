import { apiFetch } from '../api';

export interface Farm {
  id: string;
  name: string;
  crop: string;
  status: string;
}

export async function getFarmDetails(farmID: string): Promise<Farm> {
  return apiFetch<Farm>(`/farms/${farmID}`, { requiresAuth: true });
}