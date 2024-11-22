// src/components/MainViewer/index.tsx
import React, { useState } from 'react';
import { useDicomViewer } from '@/context/DicomContext';
import { DicomUploadPage } from '@/pages/DicomUploadPage';
import { DicomInfoPage } from '@/pages/DicomInfoPage';
import { StudyListPage } from '@/pages/StudyListPage';

type ViewMode = 'upload' | 'metadata' | 'studyList' | 'mpr';

export function MainViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [selectedStudyUID, setSelectedStudyUID] = useState<string | undefined>();
  const { state } = useDicomViewer();

  React.useEffect(() => {
    if (state.studies.length > 0 && viewMode === 'upload') {
      setViewMode('metadata');
    }
  }, [state.studies.length, viewMode]);

  const handleViewImages = (studyUID: string) => {
    setSelectedStudyUID(studyUID);
    setViewMode('studyList');
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
      {/* {viewMode === 'mpr' && (
        <DicomMprPage 
          studyInstanceUID={selectedStudyUID}
          onBack={() => {
            setSelectedStudyUID(undefined);
            setViewMode('metadata');
          }} 
        />
      )} */}
    </div>
  );
}
