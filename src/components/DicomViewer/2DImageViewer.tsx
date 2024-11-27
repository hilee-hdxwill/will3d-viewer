import { useEffect, useRef } from 'react';
import {
  getRenderingEngine,
  RenderingEngine,
  Types,
  Enums,
  StackViewport
} from '@cornerstonejs/core';
import initCornerstone from './cornerstone/cornerstoneInit';
import { DicomMetadataStore } from '@/utils/DicomMetadataStore';

interface ImageViewerProps {
  studyInstanceUID: string;
  seriesInstanceUID: string;
}

const ImageViewer = ({ studyInstanceUID, seriesInstanceUID }: ImageViewerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const renderingEngineRef = useRef<RenderingEngine | null>(null);
  const viewportId = 'DICOM_VIEWPORT';
  const renderingEngineId = 'DICOM_RENDERING_ENGINE';

  useEffect(() => {
    const initializeViewer = async () => {
      // Cornerstone 초기화
      await initCornerstone();

      if (!viewportRef.current) return;

      // 이전 렌더링 엔진이 있다면 제거
      const previousEngine = getRenderingEngine(renderingEngineId);
      if (previousEngine) {
        previousEngine.destroy();
      }

      // 새 렌더링 엔진 생성
      renderingEngineRef.current = new RenderingEngine(renderingEngineId);

      // 뷰포트 설정
      const viewportInput: Types.PublicViewportInput = {
        viewportId,
        element: viewportRef.current,
        type: Enums.ViewportType.STACK,
      };

      // 렌더링 엔진에 뷰포트 추가
      renderingEngineRef.current.enableElement(viewportInput);

      // DicomMetadataStore에서 이미지 데이터 가져오기
      const series = DicomMetadataStore.getSeries(studyInstanceUID, seriesInstanceUID);
      
      if (series && series.instances.length > 0) {
        // viewport를 StackViewport로 타입 지정
        const viewport = renderingEngineRef.current.getViewport(viewportId) as StackViewport;
        
        // imageId 생성
        const imageIds = series.instances.map(instance => {
          // instance의 데이터에 따라 적절한 prefix 사용
          // 예: local 파일의 경우
          return `wadouri:${instance.url || instance.SOPInstanceUID}`;
          // 또는 WADO-RS의 경우
          // return `wadors:${instance.wadoRoot}/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances/${instance.SOPInstanceUID}/frames/1`;
        });

        console.log('Generated imageIds:', imageIds); // 디버깅용

        if (imageIds.length > 0) {
          await viewport.setStack(imageIds);
          viewport.render();
        } else {
          console.error('No valid imageIds generated');
        }
      }
    };

    initializeViewer();

    // 클린업 함수
    return () => {
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy();
      }
    };
  }, [studyInstanceUID, seriesInstanceUID]);

  return (
    <div
      ref={viewportRef}
      style={{
        width: '100%',
        height: '512px',
        minHeight: '512px',
        position: 'relative',
      }}
    />
  );
};

export default ImageViewer;
