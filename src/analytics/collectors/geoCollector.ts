// src/analytics/collectors/geoCollector.ts
import geoip from 'geoip-lite';
import { IGeoInfo } from '../../models/interfaces';

export class GeoCollector {
  public async collect(ip: string): Promise<IGeoInfo> {
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