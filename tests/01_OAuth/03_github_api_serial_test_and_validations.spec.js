import {test, expect} from '@playwright/test';
import { createApiContext } from '../../utils/apiClient';

const testData = require('../../utils/testData.json');

const REPO_NAME = `playwright-test-${Date.now()}`; // Use unique name to avoid 422 errors

//test to perform CRUD operations on GitHub repositories using the API, with validations and schema checks, running in serial to maintain state across tests.
test.describe.serial('GitHub API CRUD Operations', () => {
  let api;
  console.log(`Using GitHub token for user: ${process.env.GITHUB_USER}`);

  test.beforeAll(async () => {
    api = await createApiContext();
  });

  test.afterAll(async () => {
    await api.dispose();
  });
  
  // CREATE
  test('POST - Create Repo', async () => {
    const response = await api.post('/user/repos', {
      data: { name: REPO_NAME }
    });
    expect(response.status()).toBe(201);
    console.log(`Repository '${REPO_NAME}' created successfully with POST test for username ${process.env.GITHUB_USER}`);

    // Schema validation for response body
    const body = await response.json();
    expect(body).toHaveProperty('name', REPO_NAME);
    expect(body).toHaveProperty('private', false);
    expect(body).toHaveProperty('owner');
    expect(body.owner).toHaveProperty('login', process.env.GITHUB_USER);
    console.log(`Repository '${REPO_NAME}' response body validated successfully.`);
  });

  // READ
  test('GET - Verify Repo Exists', async () => {
    const response = await api.get(`/repos/${process.env.GITHUB_USER}/${REPO_NAME}`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.name).toBe(REPO_NAME);
    console.log(`Repository '${REPO_NAME}' exists and is accessible.`);
    // Below line is optional for debugging purposes to see the full response body
    // console.log(`Repository '${REPO_NAME}' details:`, body);

    //Refactor and Optimization: We can also add schema validation here to ensure the response structure is correct
    expect(body).toHaveProperty('name', REPO_NAME);
    expect(body).toHaveProperty('private', false);
    expect(body).toHaveProperty('owner');
    expect(body.owner).toHaveProperty('login', process.env.GITHUB_USER);
    console.log(`Repository '${REPO_NAME}' GET response body validated successfully.`);
  });

  // PUT - UPDATE- Replace Repository Topics
  test('PUT - Update Repository Topics', async () => {
    const response = await api.put(`/repos/${process.env.GITHUB_USER}/${REPO_NAME}/topics`, {data: {names: testData.topics.names}});

    // GitHub returns 200 OK for a successful topic update
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.names).toContain('playwright');
    console.log(`Successfully updated topics for '${REPO_NAME}':`, body.names);
  });


  // PATCH - Partial update
  test('PATCH - Edit Repo Description', async () => {
    const response = await api.patch(`/repos/${process.env.GITHUB_USER}/${REPO_NAME}`, {
      data: { description: testData.description }
    });
    expect(response.status()).toBe(200);
    console.log(`Repository '${REPO_NAME}' description updated successfully.`);
    const updatedBody = await response.json();
    expect(updatedBody.description).toBe(testData.description);
    console.log(`Repository '${REPO_NAME}' update description:`, updatedBody.description);
    // console.log(`Repository '${REPO_NAME}' updated details:`, updatedBody);// Optional: Log the entire updated repository details for verification
  });

  // DELETE
  test('DELETE - Remove Repo', async () => {
    const response = await api.delete(`/repos/${process.env.GITHUB_USER}/${REPO_NAME}`);
    expect(response.status()).toBe(204);
    console.log(`Repository '${REPO_NAME}' deleted successfully.`);
    console.log(`Repository '${REPO_NAME}' deletion response status:`, response.status());
  });

//   // 5. CLEANUP (Teardown)
//   // This runs after all tests in this describe block finish
//   test.afterAll('DELETE - Cleanup Test Repository', async ({ playwright }) => {
//     // We create a fresh request context for the teardown
//     const requestContext = await playwright.request.newContext();
//     const response = await requestContext.delete(`/repos/${process.env.GITHUB_USER}/${REPO_NAME}`);
    
//     // Log the result to the VS Code terminal
//     if (response.status() === 204) {
//       console.log(`Successfully cleaned up repository: ${REPO_NAME}`);
//     } else {
//       console.error(`Failed to cleanup repository: ${REPO_NAME}. Status: ${response.status()}`);
//     }
//     await requestContext.dispose();
//   });
});


// How to run this test:
// 1. Ensure you have your GitHub token and username set in a .env file or as environment variables.
// 2. Run the test using the command: npm test or npx playwright test
