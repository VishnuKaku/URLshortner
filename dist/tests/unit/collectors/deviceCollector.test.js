// tests/unit/collectors/deviceCollector.test.ts
import { DeviceCollector } from '../../../src/analytics/collectors/deviceCollector';
describe('DeviceCollector', () => {
    it('should collect device information for desktop', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        const deviceCollector = new DeviceCollector();
        const device = deviceCollector.collect(userAgent);
        expect(device).toBeDefined();
        expect(device.type).toBe('desktop');
        expect(device.browser).toBe('Chrome');
        expect(device.os).toBe('Windows');
    });
    it('should detect mobile devices', () => {
        const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1';
        const deviceCollector = new DeviceCollector();
        const device = deviceCollector.collect(userAgent);
        expect(device).toBeDefined();
        expect(device.type).toBe('mobile');
        expect(device.browser).toBe('Mobile Safari');
        expect(device.os).toBe('iOS');
    });
    it('should handle unknown user agents', () => {
        const userAgent = 'unknown';
        const deviceCollector = new DeviceCollector();
        const device = deviceCollector.collect(userAgent);
        expect(device).toBeDefined();
        expect(device.type).toBe('unknown');
        expect(device.browser).toBe('unknown');
        expect(device.os).toBe('unknown');
    });
});
