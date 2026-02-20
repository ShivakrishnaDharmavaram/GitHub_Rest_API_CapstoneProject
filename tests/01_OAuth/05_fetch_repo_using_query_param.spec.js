import {test, expect} from '@playwright/test';
import { createApiContext } from '../../utils/apiClient';
test('Fetch user repositories using query parameters', async () => {
  const api = await createApiContext();
  const username = process.env.GITHUB_USER;
  const response = await api.get(`/users/${username}/repos`, {
    params: {
        type: 'owner', // Fetch only repositories owned by the user
        sort: 'created', // Sort by creation date
        direction: 'desc' // Sort in descending order
        }
    });
    
    const body = await response.json();
    const repoNames = body.map(repo => repo.name);
    //Here we used Map filter reduce to extract the names of the repositories from the response and log them to the console. This allows us to verify that we are fetching the correct repositories for the authenticated user.
    console.log(`Repositories owned by ${username}:`, repoNames);
    // console.log(`Fetched repositories for user ${username}:`, body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
});

//how to run this specific test: npx playwright test tests/tests/01_OAuth/05_fetch_repo_using_query_param.spec.js
