// src/components/DicomViewer/index.tsx
import { useEffect } from 'react';
import { ViewportGrid } from './ViewportGrid';
import { initCornerstone, cleanupCornerstone } from './cornerstone/cornerstoneInit';

interface DicomViewerProps {
  study: any;
  onBack: () => void;
}

export function DicomViewer({ study, onBack }: DicomViewerProps) {
  useEffect(() => {
    initCornerstone().catch(console.error);
    return () => {
      cleanupCornerstone();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-black">
      {/* 임시 툴바 */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
        <h1 className="text-lg text-white">DICOM Viewer</h1>
        <button
          onClick={onBack}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Back to Study List
        </button>
      </div>
      
      {/* 메인 뷰어 영역 */}
      <div className="flex-1">
        <ViewportGrid study={study} />
      </div>
    </div>
  );
}
