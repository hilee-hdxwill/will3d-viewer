// components/DicomViewer/index.tsx
import React from 'react';
import { useDicomViewer } from './DicomViewerContext';

function DicomViewer() {
  const { state } = useDicomViewer();
  
  // 첫 번째 study의 기본 정보만 추출
  const firstStudy = state.studies[0];
  const totalImages = state.studies.reduce((total, study) => 
    total + (study.imageIds?.length || 0), 0);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-white text-3xl mb-6">DICOM Files Loaded Successfully</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg text-left space-y-3">
          <p className="text-blue-300">
            Total Studies: <span className="text-white">{state.studies.length}</span>
          </p>
          <p className="text-blue-300">
            Total Images: <span className="text-white">{totalImages}</span>
          </p>
          
          {firstStudy && (
            <div className="mt-4">
              <p className="text-green-400 mb-2">First Study Information:</p>
              <p className="text-blue-300">
                Study UID: <span className="text-white">{firstStudy.studyInstanceUID}</span>
              </p>
              <p className="text-blue-300">
                Number of Images: <span className="text-white">{firstStudy.imageIds?.length || 0}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DicomViewer;
