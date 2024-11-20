// components/DicomViewer/index.tsx
import React, { useState } from 'react';
import { useDicomViewer } from './DicomViewerContext';

function DicomViewer() {
  const { state } = useDicomViewer();
  const [showDetails, setShowDetails] = useState(false);
  
  const firstStudy = state.studies[0];
  const totalImages = state.studies.reduce((total, study) => 
    total + (study.imageIds?.length || 0), 0);

  const getMetadataValue = (metadata: any, key: string) => {
    if (!metadata || !metadata[key]) return 'N/A';
    
    const value = metadata[key];
    
    // DICOM Patient Name은 특별한 처리 필요
    if (key === 'PatientName' && value.Alphabetic) {
      return value.Alphabetic;
    }
    
    // Value 배열이 있는 경우
    if (value.Value && Array.isArray(value.Value)) {
      return value.Value.join(', ');
    }
    
    // 단순 값인 경우
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    
    // 객체인 경우 JSON 문자열로 변환
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return 'Complex Object';
      }
    }
    
    return 'N/A';
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
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

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
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

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-auto py-8">
      <div className="text-center max-w-4xl w-full mx-4">
        <h1 className="text-white text-3xl mb-6">DICOM Files Loaded Successfully</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg text-left space-y-3">
          <p className="text-blue-300">
            Total Studies: <span className="text-white">{state.studies.length}</span>
          </p>
          <p className="text-blue-300">
            Total Images: <span className="text-white">{totalImages}</span>
          </p>
          
          {firstStudy && firstStudy.metadata && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-green-400 text-lg font-semibold mb-2">First Study Information:</p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-blue-300">
                  Study UID: <span className="text-white">{firstStudy.studyInstanceUID}</span>
                </p>
                <p className="text-blue-300">
                  Number of Images: <span className="text-white">{firstStudy.imageIds?.length || 0}</span>
                </p>

                {showDetails && (
                  <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                    {/* 환자 정보 섹션 */}
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">Patient Information:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-blue-300">
                          Patient Name: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'PatientName')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient ID: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'PatientID')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Birth Date: <span className="text-white">
                            {formatDate(getMetadataValue(firstStudy.metadata, 'PatientBirthDate'))}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Sex: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'PatientSex')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient Age: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'PatientAge')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient Weight: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'PatientWeight')} kg
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 스터디 정보 섹션 */}
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">Study Information:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-blue-300">
                          Study Date: <span className="text-white">
                            {formatDate(getMetadataValue(firstStudy.metadata, 'StudyDate'))}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Study Time: <span className="text-white">
                            {formatTime(getMetadataValue(firstStudy.metadata, 'StudyTime'))}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Accession Number: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'AccessionNumber')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Study Description: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'StudyDescription')}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 이미지 기술 정보 섹션 */}
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">Image Technical Information:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-blue-300">
                          Modality: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'Modality')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Manufacturer: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'Manufacturer')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Rows: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'Rows')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Columns: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'Columns')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Bits Allocated: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'BitsAllocated')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Bits Stored: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'BitsStored')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Image Type: <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, 'ImageType')}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Transfer Syntax: <span className="text-white">
                            {firstStudy.metadata.AvailableTransferSyntaxUID || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => console.log('Full metadata:', firstStudy.metadata)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Log Full Metadata to Console
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DicomViewer;
