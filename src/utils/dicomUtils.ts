// src/utils/dicomUtils.ts
import { DicomImageMetadata } from '@/types/dicom';

export const extractRenderingMetadata = (dataset: any): DicomImageMetadata => {
  return {
    // 이미지 데이터 관련
    rows: Number(getMetadataValue(dataset, 'Rows')),
    columns: Number(getMetadataValue(dataset, 'Columns')),
    bitsAllocated: Number(getMetadataValue(dataset, 'BitsAllocated')),
    bitsStored: Number(getMetadataValue(dataset, 'BitsStored')),
    highBit: Number(getMetadataValue(dataset, 'HighBit')),
    pixelRepresentation: Number(getMetadataValue(dataset, 'PixelRepresentation')),
    
    // 이미지 표시 관련
    windowCenter: Number(getMetadataValue(dataset, 'WindowCenter')),
    windowWidth: Number(getMetadataValue(dataset, 'WindowWidth')),
    rescaleIntercept: Number(getMetadataValue(dataset, 'RescaleIntercept')),
    rescaleSlope: Number(getMetadataValue(dataset, 'RescaleSlope')),
    photometricInterpretation: getMetadataValue(dataset, 'PhotometricInterpretation'),
    
    // 3D 볼륨 관련
    imagePosition: dataset.ImagePositionPatient as [number, number, number],
    imageOrientation: dataset.ImageOrientationPatient as [number, number, number, number, number, number],
    pixelSpacing: dataset.PixelSpacing ? [Number(dataset.PixelSpacing[0]), Number(dataset.PixelSpacing[1])] as [number, number] : undefined,
    sliceThickness: Number(dataset.SliceThickness) || undefined,
    spacingBetweenSlices: Number(dataset.SpacingBetweenSlices) || undefined
  };
};

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
