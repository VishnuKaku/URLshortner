// src/analytics/collectors/geoCollector.ts
import geoip from 'geoip-lite';
export class GeoCollector {
    async collect(ip) {
        const geo = geoip.lookup(ip);
        if (!geo) {
            return {
                country: 'unknown',
                region: 'unknown',
                city: 'unknown',
                timezone: 'unknown',
            };
        }
        return {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            timezone: geo.timezone,
        };
    }
}
