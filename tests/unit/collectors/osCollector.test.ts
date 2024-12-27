// Unit test for OS collector 
// src/analytics/collectors/osCollector.ts
import UAParser from 'ua-parser-js';

export class OSCollector {
  collect(userAgent: string): string {
    const parser = new UAParser(userAgent);
    const os = parser.getOS();
    return os.name || 'unknown';
  }
}