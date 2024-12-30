import { afterAll, afterEach, beforeAll, jest } from '@jest/globals';
beforeAll(async () => {
    // Increase timeout
    jest.setTimeout(30000);
});
afterEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();
});
afterAll(async () => {
    // Clean up
});
