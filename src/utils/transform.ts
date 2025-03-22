import { formatToThaiDate } from './dateFormatter';

// Fields that should be treated as dates (in snake_case as received from API)
const dateFields = ['pr_date', 'po_date', 'request_date', 'delivery_date'];

/**
 * Convert snake_case keys to camelCase and format date fields
 */
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // Check if this is a date field that needs special handling
      if (dateFields.includes(key) && obj[key]) {
        // Format the date field to Thai format
        acc[camelKey] = formatToThaiDate(obj[key]);
      } else {
        // Process other fields normally
        acc[camelKey] = snakeToCamel(obj[key]);
      }
      
      return acc;
    }, {} as any);
  }
  return obj;
}