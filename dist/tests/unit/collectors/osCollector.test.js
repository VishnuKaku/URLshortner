// tests/unit/collectors/osCollector.test.ts
import { OSCollector } from '../../../src/analytics/collectors/osCollector';
describe('OSCollector', () => {
    it('should collect the OS name from a user agent', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        const osCollector = new OSCollector();
        const osName = osCollector.collect(userAgent);
        expect(osName).toBe('Windows');
    });
    it('should return "unknown" for an unknown user agent', () => {
        const userAgent = 'unknown';
        const osCollector = new OSCollector();
        const osName = osCollector.collect(userAgent);
        expect(osName).toBe('unknown');
    });
});
