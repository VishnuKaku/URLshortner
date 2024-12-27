import { UAParser } from 'ua-parser-js';
import { IDevice } from "../../../src/models/interfaces";

export class DeviceCollector {
  collect(userAgent: string): IDevice {
    const parser = new UAParser(); // Corrected usage
    parser.setUA(userAgent); // Set the user agent
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    return {
      type: device.type || 'unknown',
      browser: browser.name || 'unknown',
      os: os.name || 'unknown'
    };
  }
}
