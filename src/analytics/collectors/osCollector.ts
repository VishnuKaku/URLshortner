// src/analytics/collectors/osCollector.ts
import { UAParser } from 'ua-parser-js';

export class OSCollector {
  public collect(userAgent: string): string {
    const parser = new UAParser();
    const os = parser.setUA(userAgent).getOS();
    return os.name || 'unknown';
  }
}