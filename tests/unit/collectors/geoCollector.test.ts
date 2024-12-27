// Unit test for geo collector 
// src/analytics/collectors/geoCollector.ts
import { ILocation } from '../../models/interfaces';
import axios from 'axios';

export class GeoCollector {
  private readonly geoApiKey: string;

  constructor() {
    this.geoApiKey = process.env.GEO_API_KEY || '';
  }

  async collect(ipAddress: string): Promise<ILocation> {
    try {
      // Using a free IP geolocation service (replace with your preferred provider)
      const response = await axios.get(
        `https://api.ipstack.com/${ipAddress}?access_key=${this.geoApiKey}`
      );

      return {
        country: response.data.country_name,
        city: response.data.city,
        region: response.data.region_name,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      };
    } catch (error) {
      console.error('Geolocation error:', error);
      return {};
    }
  }
}