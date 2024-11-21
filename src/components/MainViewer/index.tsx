// src/components/MainViewer/index.tsx
import React, { useState } from 'react';
import { useDicomViewer } from '../../context/DicomContext';
import { DicomUploadPage } from '../../pages/DicomUploadPage';
import { DicomInfoPage } from '../../pages/DicomInfoPage';
import { DicomMprPage } from '../../pages/DicomMprPage';

type ViewMode = 'upload' | 'metadata' | 'mpr';

export function MainViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const { state } = useDicomViewer();

  // studies가 있으면 metadata 뷰로 자동 전환
  React.useEffect(() => {
    if (state.studies.length > 0 && viewMode === 'upload') {
      setViewMode('metadata');
    }
  }, [state.studies.length, viewMode]);

  return (
    <div className="w-full h-full">
      {viewMode === 'upload' && (
        <DicomUploadPage onUploadSuccess={() => setViewMode('metadata')} />
      )}
      {viewMode === 'metadata' && (
        <DicomInfoPage onMPRClick={() => setViewMode('mpr')} />
      )}
      {viewMode === 'mpr' && (
        <DicomMprPage onBack={() => setViewMode('metadata')} />
      )}
    </div>
  );
}
