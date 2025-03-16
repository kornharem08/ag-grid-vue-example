export function snakeToCamel(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => snakeToCamel(item));
    }
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = snakeToCamel(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }