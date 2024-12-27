// URL validator utility 
// src/utils/urlValidator.ts
import { URL } from 'url';

export class UrlValidator {
  public static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static isValidAlias(alias: string): boolean {
    const aliasRegex = /^[a-zA-Z0-9-_]{4,15}$/;
    return aliasRegex.test(alias);
  }

  public static isValidTopic(topic: string): boolean {
    const validTopics = ['acquisition', 'activation', 'retention'];
    return validTopics.includes(topic.toLowerCase());
  }

  public static sanitizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
}