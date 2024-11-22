// src/components/DicomViewer/ViewportGrid.tsx
import { useEffect, useRef } from 'react';
import { createViewport, getImageIdsFromDicomStudy } from './cornerstone/helpers';

interface ViewportGridProps {
  study: any;
}

export function ViewportGrid({ study }: ViewportGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewportRef.current || !study) return;

    const imageIds = getImageIdsFromDicomStudy(study);
    if (imageIds.length === 0) return;

    const element = viewportRef.current;
    
    createViewport({
      element,
      imageIds,
      viewportId: `viewport-${study.studyInstanceUID}`,
    }).catch(console.error);

    return () => {
      // cleanup
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
