import { test, expect } from '@playwright/test';
import { createApiContext } from '../../utils/apiClient';
import { createRepoPayload } from '../../utils/testData';

const payload = createRepoPayload();

test('Create a GitHub repository', async () => {
  const api = await createApiContext();

  const response = await api.post('/user/repos', {
    data: payload
  });

  const body = await response.json();
  console.log(`Repository '${payload.name}' created successfully with POST test for username ${process.env.GITHUB_USER}`);
  // console.log('Received repository data:', body);

  expect(response.status()).toBe(201);
  expect(body.name).toBe(payload.name);
  expect(body.private).toBe(false);
});

//Delete the created repository after the test to keep the environment clean
test.afterAll(async () => {
  const api = await createApiContext();
  //DELETE - Delete the created repository
  // Optional: Delete the repository after tests complete
  await api.delete(`/repos/${process.env.GITHUB_USER}/${payload.name}`);
  console.log(`Repository '${payload.name}' deleted successfully.`);
});