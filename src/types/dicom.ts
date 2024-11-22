// src/types/dicom.ts
export interface DicomStudy {
    studyInstanceUID: string;
    imageIds: string[];
    metadata: any; // 더 구체적인 타입이 필요하다면 나중에 추가
}
  
 export interface DicomViewerState {
    studies: DicomStudy[];
    isLoading: boolean;
    error: string | null;
}