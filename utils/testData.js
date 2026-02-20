export function createRepoPayload() {
  return {
    name: `playwright-api-${Date.now()}`,
    description: 'API automation using Playwright',
    private: false
  };
}
