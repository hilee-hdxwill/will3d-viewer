// src/utils/dicomUtils.ts

export const getMetadataValue = (metadata: any, key: string) => {
    if (!metadata || !metadata[key]) return 'N/A';
    
    const value = metadata[key];
    
    if (key === 'PatientName' && value.Alphabetic) {
      return value.Alphabetic;
    }
    
    if (value.Value && Array.isArray(value.Value)) {
      return value.Value.join(', ');
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return 'Complex Object';
      }
    }
    
    return 'N/A';
};
  
export const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
};
  
export const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      const hours = timeString.substring(0, 2);
      const minutes = timeString.substring(2, 4);
      const seconds = timeString.substring(4, 6);
      return `${hours}:${minutes}:${seconds}`;
    } catch {
      return timeString;
    }
};
