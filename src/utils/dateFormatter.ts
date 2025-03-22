// src/utils/dateFormatter.ts

// Map for English month abbreviations to Thai abbreviations
const monthMap: Record<string, string> = {
  'Jan': 'ม.ค.',
  'Feb': 'ก.พ.',
  'Mar': 'มี.ค.',
  'Apr': 'เม.ย.',
  'May': 'พ.ค.',
  'Jun': 'มิ.ย.',
  'Jul': 'ก.ค.',
  'Aug': 'ส.ค.',
  'Sep': 'ก.ย.',
  'Oct': 'ต.ค.',
  'Nov': 'พ.ย.',
  'Dec': 'ธ.ค.'
};

/**
 * Formats a date string to Thai format (DD MMM YY)
 * @param dateStr Date string in various formats like '08-Jan-24', '2024-01-08', or '30 Jan 24'
 * @returns Formatted date string in Thai format (e.g., '8 ม.ค. 24')
 */
export function formatToThaiDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  
  // Check if the date is already in Thai format
  if (dateStr.includes('ม.ค.') || dateStr.includes('ก.พ.') || dateStr.includes('มี.ค.') ||
      dateStr.includes('เม.ย.') || dateStr.includes('พ.ค.') || dateStr.includes('มิ.ย.') ||
      dateStr.includes('ก.ค.') || dateStr.includes('ส.ค.') || dateStr.includes('ก.ย.') ||
      dateStr.includes('ต.ค.') || dateStr.includes('พ.ย.') || dateStr.includes('ธ.ค.')) {
    return dateStr;
  }
  
  let date: Date;
  
  // Clean the input string
  const cleanDateStr = dateStr.trim();
  
  try {
    // Common date formats regex
    const ddMmmYyRegex = /^(\d{1,2})[ -](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ -](\d{2,4})$/i;
    const isoDateRegex = /^(\d{4})[ -](\d{1,2})[ -](\d{1,2})$/;
    
    if (ddMmmYyRegex.test(cleanDateStr)) {
      // Format: '08-Jan-24' or '8 Jan 24'
      const matches = cleanDateStr.match(ddMmmYyRegex);
      if (!matches) return cleanDateStr;
      
      const day = parseInt(matches[1]);
      const month = matches[2];
      let year = matches[3];
      
      // Add century if year is only 2 digits
      if (year.length === 2) {
        year = '20' + year;
      }
      
      // Get the month index (0-based)
      const monthIndex = Object.keys(monthMap).findIndex(m => m.toLowerCase() === month.toLowerCase());
      if (monthIndex === -1) return cleanDateStr;
      
      date = new Date(parseInt(year), monthIndex, day);
    } else if (isoDateRegex.test(cleanDateStr)) {
      // ISO format: '2024-01-08'
      date = new Date(cleanDateStr);
    } else {
      // Try to parse as is
      date = new Date(cleanDateStr);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return cleanDateStr;
    }
    
    // Get day, month and year
    const day = date.getDate();
    const monthEn = date.toLocaleString('en-US', { month: 'short' });
    const monthThai = monthMap[monthEn] || monthEn;
    const year = String(date.getFullYear()).slice(2); // Get last 2 digits of year
    
    // Format as DD MMM YY in Thai (with spaces, not dashes)
    return `${day} ${monthThai} ${year}`;
  } catch (error) {
    return cleanDateStr;
  }
} 