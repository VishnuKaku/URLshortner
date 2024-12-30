// src/analytics/collectors/osCollector.ts
import { UAParser } from 'ua-parser-js';
export class OSCollector {
    collect(userAgent) {
        const parser = new UAParser();
        const os = parser.setUA(userAgent).getOS();
        return os.name || 'unknown';
    }
}
