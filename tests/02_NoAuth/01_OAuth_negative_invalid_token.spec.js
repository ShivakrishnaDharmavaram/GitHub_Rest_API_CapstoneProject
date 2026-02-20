import { test, expect } from '@playwright/test';



test('Fail when token is invalid', async ({ request }) => {
  const response = await request.get(
    'https://api.github.com/user',
    {
      headers: { Authorization: 'Bearer invalid_token' },
    }
  );

  expect(response.status()).toBe(401);
  console.log('Received error:', await response.text());
});
