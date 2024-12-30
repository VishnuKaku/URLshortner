import * as UAParser from 'ua-parser-js';

export class DeviceCollector {
  private parser: UAParser.UAParser;

  constructor() {
    this.parser = new UAParser.UAParser();
  }

  collect(userAgent: string) {
    if (!userAgent) {
      return {
        type: 'unknown',
        browser: 'unknown',
        os: 'unknown'
      };
    }

    this.parser.setUA(userAgent);
    
    const device = this.parser.getDevice();
    const browser = this.parser.getBrowser();
    const os = this.parser.getOS();

    // Check if we have any valid device information
    const hasValidDeviceInfo = device.type || 
                              /mobile|iphone|ipad|android/i.test(userAgent.toLowerCase()) ||
                              browser.name ||
                              os.name;

    if (!hasValidDeviceInfo) {
      return {
        type: 'unknown',
        browser: 'unknown',
        os: 'unknown'
      };
    }

    // More comprehensive mobile device detection
    const isMobile = Boolean(
      device.type === 'mobile' ||
      device.type === 'tablet' ||
      /mobile|iphone|ipad|android/i.test(userAgent.toLowerCase())
    );

    return {
      type: isMobile ? 'mobile' : 'desktop',
      browser: browser.name || 'unknown',
      os: os.name || 'unknown'
    };
  }
}