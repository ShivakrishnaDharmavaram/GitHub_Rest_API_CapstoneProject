import {test, expect} from '@playwright/test';
import dotenv from "dotenv";
import path from "path";
dotenv.config();

// const REPO_NAME = 'playwright-test-repo'; // Use a fixed name for simplicity, but consider using a unique name in real tests to avoid conflicts
const REPOUNIQUE_NAME = `playwright-test-repo-${Date.now()}`; // Use unique name to avoid 422 errors
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = process.env.GITHUB_USER;

test.use({
  baseURL: 'https://api.github.com',
  extraHTTPHeaders: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${GITHUB_TOKEN}`,
  },
});

test('Should create a new GitHub repository', async ({ request }) => {
  const response = await request.post('/user/repos', {
    data: {
      name: REPOUNIQUE_NAME,
      description: 'Created via Playwright API test',
      private: false
    }
  });

  // Verify status code
  expect(response.status()).toBe(201);

  // Validate response body content
  const body = await response.json();
  expect(body.name).toBe(REPOUNIQUE_NAME);
  console.log(`Repository '${REPOUNIQUE_NAME}' created successfully.`);

  // retrive the created repository to verify it exists
  const getResponse = await request.get(`/repos/${process.env.GITHUB_USER}/${REPOUNIQUE_NAME}`);
  expect(getResponse.ok()).toBeTruthy();
  const getBody = await getResponse.json();
  expect(getBody.name).toBe(REPOUNIQUE_NAME);
  console.log(`Repository '${REPOUNIQUE_NAME}' exists and is accessible.`);

  //PUT - Update Repository Topics
  const putResponse = await request.put(`/repos/${process.env.GITHUB_USER}/${REPOUNIQUE_NAME}/topics`, {
    data: { names: ['playwright', 'testing', 'api'] }
  });
  expect(putResponse.status()).toBe(200);
  const putBody = await putResponse.json();
  expect(putBody.names).toContain('playwright');
  console.log(`Successfully updated topics for '${REPOUNIQUE_NAME}':`, putBody.names);

  //PATCH - Edit Repo Description
  const patchResponse = await request.patch(`/repos/${process.env.GITHUB_USER}/${REPOUNIQUE_NAME}`, {
    data: { description: 'Updated description via PATCH' }
  });
  expect(patchResponse.status()).toBe(200);
  const patchBody = await patchResponse.json();
  expect(patchBody.description).toBe('Updated description via PATCH');
  console.log(`Repository '${REPOUNIQUE_NAME}' description updated successfully.`);
  console.log(`Repository '${REPOUNIQUE_NAME}' updated description:`, patchBody.description);

});

test.afterAll(async ({ request }) => {
  //DELETE - Delete the created repository
  // Optional: Delete the repository after tests complete
  await request.delete(`/repos/${process.env.GITHUB_USER}/${REPOUNIQUE_NAME}`);  // With / to ensure correct endpoint
  console.log(`Repository '${REPOUNIQUE_NAME}' deleted successfully.`);
});