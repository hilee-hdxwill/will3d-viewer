// components/DicomViewer/MPRViewer.tsx
import React, { useEffect, useRef } from 'react';
import { 
  init as csInit,
  RenderingEngine,
  Types,
  Enums,
  volumeLoader,
  cache,
} from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';
import { useDicomViewer } from './DicomViewerContext';

function MPRViewer() {
  const { state } = useDicomViewer();
  const viewportRef = useRef<HTMLDivElement>(null);
  const renderingEngineRef = useRef<RenderingEngine | null>(null);

  useEffect(() => {
    const initMPR = async () => {
      if (!state.studies.length || !state.studies[0].imageIds.length) {
        console.log('No DICOM data available');
        return;
      }

      if (!viewportRef.current) {
        console.log('Viewport element not ready');
        return;
      }

      try {
        // Cornerstone 초기화
        await csInit();
        await csToolsInit();

        const firstStudy = state.studies[0];
        const imageIds = firstStudy.imageIds;
        console.log('Loading images:', imageIds);

        // 렌더링 엔진 설정
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);
        renderingEngineRef.current = renderingEngine;

        // 뷰포트 설정
        const viewportInput: Types.PublicViewportInput = {
          viewportId: 'MPR_STACK',
          element: viewportRef.current,
          type: Enums.ViewportType.ORTHOGRAPHIC,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
            background: [0, 0, 0],
          },
        };

        // 요소 활성화
        renderingEngine.enableElement(viewportInput);

        // 볼륨 생성
        const volumeId = 'CT_VOLUME';
        
        // VolumeLoaderOptions 타입에 맞게 수정
        const volume = await volumeLoader.createAndCacheVolume(volumeId, {
          imageIds,
        });

        // 볼륨 로드
        await volume.load();

        // 뷰포트에 볼륨 설정
        const viewport = renderingEngine.getViewport(viewportInput.viewportId) as Types.IVolumeViewport;
        
        await viewport.setVolumes([
          {
            volumeId,
            callback: ({ volumeActor }) => {
              // 볼륨 속성 설정
              volumeActor.getProperty().setInterpolationTypeToLinear();
              volumeActor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
            },
          },
        ]);

        viewport.render();

      } catch (error) {
        console.error('Error initializing MPR:', error);
      }
    };

    initMPR();

    return () => {
      // Cleanup
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy();
      }

      // 캐시 정리
      cache.purgeCache();
    };
  }, [state.studies]);

  if (!state.studies.length) {
    return <div className="text-white">No DICOM data loaded</div>;
  }

  return (
    <div className="h-screen w-screen bg-black">
      <div 
        ref={viewportRef}
        className="w-full h-full"
        style={{ position: 'relative', overflow: 'hidden' }}
      />
    </div>
  );
}

export default MPRViewer;
