// src/components/DicomViewer/ViewportGrid.tsx
import { useRef, useEffect } from 'react';
import { getRenderingEngine } from '@cornerstonejs/core';
import { createViewport, formatImageId } from './cornerstone/helpers';

interface ViewportGridProps {
  study: any;
}

export function ViewportGrid({ study }: ViewportGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('ViewportGrid로 전달된 study:', study);
    if (!viewportRef.current || !study || !study.imageIds?.length) return;
    console.log('Viewport element:', viewportRef.current);
    console.log('Study imageIds:', study.imageIds);

    const element = viewportRef.current;
    // 이미지 ID 형식 변환
    const formattedImageIds = study.imageIds.map(formatImageId);

    // viewport 생성 및 이미지 로드
    createViewport({
      element,
      studyUID: study.studyInstanceUID,
      imageIds: formattedImageIds,
    }).catch(console.error);

    // cleanup
    return () => {
      try {
        const engine = getRenderingEngine(study.studyInstanceUID);
        if (engine) {
          engine.destroy();
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, [study]);

  return (
    <div className="h-full w-full bg-black">
      <div 
        ref={viewportRef}
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
