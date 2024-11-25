// src/components/DicomViewer/index.tsx
import { useEffect, useState } from 'react';
import { initCornerstone, cleanupCornerstone } from './cornerstone/cornerstoneInit';
//import { ViewportGrid } from './ViewportGrid';

interface DicomViewerProps {
  study: any;  // 나중에 타입을 더 구체적으로 정의할 예정
  onBack: () => void;
}

export function DicomViewer({ study, onBack }: DicomViewerProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initCornerstone();
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('DicomViewer: Cornerstone 초기화 실패:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      cleanupCornerstone();
    };
  }, []);

  if (!isInitialized) {
    return <div>Initializing viewer...</div>;
  }

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
        {/* <ViewportGrid study={study} /> */}
      </div>
    </div>
  );
}
