// src/components/DicomViewer/cornerstone/cornerstoneInit.ts
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

export async function initCornerstone() {
  try {
    await cornerstone.init();
    await cornerstoneTools.init();

    // DICOM Image Loader 초기화
    await dicomImageLoader.initialize({
      useWebWorkers: true,
      webWorkerTaskPath: '/cornerstoneDICOMImageLoaderWebWorker.js',
      taskConfiguration: {
        decodeConfig: {
          convertFloatPixelDataToInt: false,
          use16BitDataType: false,
        },
      },
    });

    // 기본 도구 설정
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);

    // 기본 도구 활성화
    cornerstoneTools.setToolActive('WindowLevel', { bindings: [{ mouseButton: 1 }] });
    cornerstoneTools.setToolActive('Pan', { bindings: [{ mouseButton: 2 }] });
    cornerstoneTools.setToolActive('Zoom', { bindings: [{ mouseButton: 3 }] });
    cornerstoneTools.setToolActive('StackScroll', { bindings: [{ mouseButton: 1 }] });

    console.log('Cornerstone 초기화 완료');
  } catch (error) {
    console.error('Cornerstone 초기화 실패:', error);
    throw error;
  }
}

export function cleanupCornerstone() {
  // DICOM Image Loader 정리
  dicomImageLoader.destroy();
  // Cornerstone Core 정리
  cornerstone.destroy();
}
