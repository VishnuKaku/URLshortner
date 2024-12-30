// tests/unit/collectors/geoCollector.test.ts
import { GeoCollector } from '../../../src/analytics/collectors/geoCollector';
import geoip from 'geoip-lite';

// Update the mock to match the exact shape of geoip.lookup return value
jest.mock('geoip-lite', () => ({
  lookup: jest.fn().mockReturnValue({
    country: 'US',
    region: 'NY',
    city: 'New York',
    timezone: 'America/New_York',
    ll: [40.7128, -74.0060],  // Adding required ll property
    range: [3479298048, 3479300095],  // Adding required range property
    metro: 501,  // Adding required metro property
    area: 1  // Adding required area property
  })
}));

describe('GeoCollector', () => {
    it('should collect geolocation information for a valid IP', async () => {
        const mockGeo = {
            country: 'US',
            region: 'NY',
            city: 'New York',
            timezone: 'America/New_York',
        };

        const geoCollector = new GeoCollector();
        const location = await geoCollector.collect('8.8.8.8');

        expect(location).toEqual(mockGeo);
    });

    it('should return default values for an invalid IP', async () => {
        // Override the mock for this specific test
        (geoip.lookup as jest.Mock).mockReturnValueOnce(null);

        const geoCollector = new GeoCollector();
        const location = await geoCollector.collect('invalid-ip');

        expect(location).toEqual({
            country: 'unknown',
            region: 'unknown',
            city: 'unknown',
            timezone: 'unknown',
        });
    });
});