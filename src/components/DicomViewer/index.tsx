// src/components/DicomViewer/index.tsx
import { useEffect } from 'react';
//import { initCornerstone, cleanupCornerstone } from './cornerstone/cornerstoneInit';
import { ViewportGrid } from './ViewportGrid';

interface DicomViewerProps {
  study: any;  // 나중에 타입을 더 구체적으로 정의할 예정
  onBack: () => void;
}

export function DicomViewer({ study, onBack }: DicomViewerProps) {
  useEffect(() => {
    //console.log('DicomViewer로 전달된 study 객체:', study);
    //console.log('study의 imageIds:', study.imageIds);
    //console.log('study의 metadata:', study.metadata);

    //initCornerstone().catch(console.error);
    
    // return () => {
    //   cleanupCornerstone();
    // };
  }, [study]);

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
        <h1 className="text-lg text-white">DICOM Viewer</h1>
        <button
          onClick={onBack}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Back to Study List
        </button>
      </div>
      <div className="flex-1">
        <ViewportGrid study={study} />
      </div>
    </div>
  );
}
