// src/types/dicom.ts
export interface DicomImageMetadata {
    // 이미지 데이터 관련
    rows: number;
    columns: number;
    bitsAllocated: number;
    bitsStored: number;
    highBit: number;
    pixelRepresentation: number;
    
    // 이미지 표시 관련
    windowCenter: number;
    windowWidth: number;
    rescaleIntercept: number;
    rescaleSlope: number;
    photometricInterpretation: string;
    
    // 3D 볼륨 관련
    imagePosition?: [number, number, number];
    imageOrientation?: [number, number, number, number, number, number];
    pixelSpacing?: [number, number];
    sliceThickness?: number;
    spacingBetweenSlices?: number;
}

export interface DicomStudy {
    // 필수 식별자
    seriesInstanceUID: string;
    studyInstanceUID: string;
    sopInstanceUID: string;
    imageIds: string[];
    
    // 렌더링 필수 메타데이터
    renderingMetadata: DicomImageMetadata;
    
    // 추가 정보 (환자 정보 등 비렌더링 데이터)
    metadata: any;
}

export interface DicomViewerState {
    studies: DicomStudy[];
    isLoading: boolean;
    error: string | null;
}
