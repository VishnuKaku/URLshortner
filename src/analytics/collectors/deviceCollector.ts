// Device collector logic 
// src/analytics/collectors/DeviceCollector.ts
import UAParser from 'ua-parser-js';
import { IDeviceInfo } from '../../interfaces';

export class DeviceCollector {
  private parser: UAParser;

  constructor() {
    this.parser = new UAParser();
  }

  public collect(userAgent: string): IDeviceInfo {
    this.parser.setUA(userAgent);
    const device = this.parser.getDevice();
    const browser = this.parser.getBrowser();

    return {
      type: device.type || 'unknown',
      model: device.model || 'unknown',
      vendor: device.vendor || 'unknown',
      browser: browser.name || 'unknown',
      browserVersion: browser.version || 'unknown'
    };
  }
}
