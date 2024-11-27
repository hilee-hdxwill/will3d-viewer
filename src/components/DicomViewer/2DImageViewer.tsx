import React, { useEffect, useRef, useState } from 'react';
import { 
  RenderingEngine, 
  Types,
  Enums,
} from '@cornerstonejs/core';
import { DicomMetadataStore } from '@/utils/DicomMetadataStore';
import initCornerstone from './cornerstone/cornerstoneInit';

interface ImageViewerProps {
  studyInstanceUID: string;
  seriesInstanceUID: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
  studyInstanceUID,
  seriesInstanceUID,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [renderingEngine, setRenderingEngine] = useState<RenderingEngine | null>(null);
  const [viewport, setViewport] = useState<Types.IStackViewport | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const initializeViewer = async () => {
      await initCornerstone();
      if (!viewportRef.current) return;

      try {
        // Get series data from DicomMetadataStore
        const series = DicomMetadataStore.getSeries(studyInstanceUID, seriesInstanceUID);
        if (!series || !series.instances || series.instances.length === 0) {
          console.error('No instances found for series');
          return;
        }

        // Initialize rendering engine
        const renderingEngineId = 'myRenderingEngine';
        const viewportId = 'STACK_VIEWPORT';
        
        const engine = new RenderingEngine(renderingEngineId);
        setRenderingEngine(engine);

        // Create viewport input
        const viewportInput = {
          viewportId,
          element: viewportRef.current,
          type: Enums.ViewportType.STACK,
        };

        // Enable element
        await engine.enableElement(viewportInput);

        // Get viewport
        const stackViewport = engine.getStackViewport(viewportId);
        setViewport(stackViewport);

        // Get image IDs from series instances
        const imageIds = series.instances.map((instance: any) => instance.url);

        // Set the stack of images
        await stackViewport.setStack(imageIds);

        // Set initial image
        await stackViewport.setImageIdIndex(0);

        // Render
        engine.render();

      } catch (error) {
        console.error('Error initializing viewer:', error);
      }
    };

    initializeViewer();

    // Cleanup
    return () => {
      if (renderingEngine) {
        renderingEngine.destroy();
      }
    };
  }, [studyInstanceUID, seriesInstanceUID]);

  // Handle image navigation
  const handleImageNavigation = async (direction: 'prev' | 'next') => {
    if (!viewport) return;

    const series = DicomMetadataStore.getSeries(studyInstanceUID, seriesInstanceUID);
    const maxIndex = series.instances.length - 1;
    
    const newIndex = direction === 'next' 
      ? Math.min(currentImageIndex + 1, maxIndex)
      : Math.max(currentImageIndex - 1, 0);

    if (newIndex !== currentImageIndex) {
      await viewport.setImageIdIndex(newIndex);
      setCurrentImageIndex(newIndex);
      renderingEngine?.render();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={viewportRef}
        className="w-full h-full bg-black"
        style={{ minHeight: '500px' }}
      />
      
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => handleImageNavigation('prev')}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentImageIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => handleImageNavigation('next')}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentImageIndex === (DicomMetadataStore.getSeries(studyInstanceUID, seriesInstanceUID)?.instances.length ?? 0) - 1}
        >
          Next
        </button>
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
        Image: {currentImageIndex + 1} / {DicomMetadataStore.getSeries(studyInstanceUID, seriesInstanceUID)?.instances.length ?? 0}
      </div>
    </div>
  );
};

export default ImageViewer;
