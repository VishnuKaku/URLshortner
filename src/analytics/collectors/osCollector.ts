// OS collector logic 
// src/analytics/collectors/OSCollector.ts
export class OSCollector {
    private parser: UAParser;
  
    constructor() {
      this.parser = new UAParser();
    }
  
    public collect(userAgent: string): {
      name: string;
      version: string;
    } {
      this.parser.setUA(userAgent);
      const os = this.parser.getOS();
  
      return {
        name: os.name || 'unknown',
        version: os.version || 'unknown'
      };
    }
  }