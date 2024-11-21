// src/types/dicom.ts
export interface Study {
    studyInstanceUID: string;
    imageIds: string[];
    metadata?: any;
}
  
export interface DicomViewerState {
    studies: Study[];
    isLoading: boolean;
    error: string | null;
}