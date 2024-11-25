// src/components/MainViewer/index.tsx
import React, { useState } from 'react';
import { useDicomViewer } from '@/context/DicomContext';
import { DicomUploadPage } from '@/pages/DicomUploadPage';
import { DicomInfoPage } from '@/pages/DicomInfoPage';
import { StudyListPage } from '@/pages/StudyListPage';
import { DicomViewer } from '@/components/DicomViewer';

type ViewMode = 'upload' | 'metadata' | 'studyList' | 'mpr' | 'dicomViewer';  // dicomViewer 추가

export function MainViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [selectedStudy, setSelectedStudy] = useState<any>(null);  // 선택된 study 저장
  const { state } = useDicomViewer();

  React.useEffect(() => {
    if (state.studies.length > 0 && viewMode === 'upload') {
      setViewMode('metadata');
    }
  }, [state.studies.length, viewMode]);

  const handleViewImages = (studyUID: string) => {
    const study = state.studies.find(s => s.studyInstanceUID === studyUID);
    if (study) {
      setSelectedStudy(study);
      setViewMode('dicomViewer');
    }
  };

  return (
    <div className="w-full h-full">
      {viewMode === 'upload' && (
        <DicomUploadPage onUploadSuccess={() => setViewMode('metadata')} />
      )}
      {viewMode === 'metadata' && (
        <DicomInfoPage 
          onStudyListClick={() => setViewMode('studyList')} 
        />
      )}
      {viewMode === 'studyList' && (
        <StudyListPage 
          onBack={() => setViewMode('metadata')}
          onViewImages={handleViewImages}
        />
      )}
      {viewMode === 'dicomViewer' && selectedStudy && (
        <DicomViewer 
          study={selectedStudy}
          onBack={() => setViewMode('studyList')} 
        />
      )}
    </div>
  );
}
