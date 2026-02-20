import { test, expect } from '@playwright/test';
import { createApiContext } from '../../utils/apiClient';

test('Get authenticated user', async () => {
  const api = await createApiContext();

  const response = await api.get('/user');
  const body = await response.json();

  expect(response.status()).toBe(200);
  console.log(`Authenticated user: ${body.login} (ID: ${body.id})`);
  expect(body).toHaveProperty('login');
  expect(body).toHaveProperty('id');
});
