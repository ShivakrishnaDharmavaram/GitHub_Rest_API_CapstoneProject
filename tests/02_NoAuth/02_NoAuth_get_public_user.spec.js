import { test, expect } from '@playwright/test';

test('Get public user information without authentication', async ({ request }) => {
  const response = await request.get('https://api.github.com/users/octocat');
  const body = await response.json();
  expect(response.status()).toBe(200);
  console.log(`Public user: ${body.login} (ID: ${body.id})`);
  console.log('Received user data:', body);
  expect(body).toHaveProperty('login');
  expect(body).toHaveProperty('id');
});
