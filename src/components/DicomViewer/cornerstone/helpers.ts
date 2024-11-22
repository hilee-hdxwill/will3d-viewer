// src/components/DicomViewer/cornerstone/helpers.ts
import * as cornerstone from '@cornerstonejs/core';

export interface ViewportOptions {
  element: HTMLDivElement;
  imageIds: string[];
  viewportId?: string;
}

export async function createViewport({ element, imageIds, viewportId = 'DEFAULT' }: ViewportOptions) {
  try {
    const renderingEngine = new cornerstone.RenderingEngine(viewportId);
    
    const viewportInput = {
      viewportId,
      element,
      type: cornerstone.Enums.ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(viewportId);

    await viewport.setStack(imageIds);
    
    viewport.render();

    return viewport;
  } catch (error) {
    console.error('뷰포트 생성 실패:', error);
    throw error;
  }
}

export function getImageIdsFromDicomStudy(study: any) {
  const imageIds: string[] = [];
  if (Array.isArray(study.imageIds)) {
    study.imageIds.forEach((imageId: string) => {
      // dicomfile:// 프로토콜로 변환
      if (!imageId.startsWith('dicomfile://')) {
        imageIds.push(`dicomfile://${imageId}`);
      } else {
        imageIds.push(imageId);
      }
    });
  }
  return imageIds;
}
