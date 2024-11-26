// // src/components/DicomViewer/cornerstone/cornerstoneInit.ts
// import { init as csInit, getRenderingEngines } from '@cornerstonejs/core';
// import { init as csToolsInit } from '@cornerstonejs/tools';
// import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';

// export async function initCornerstone() {
//   try {
//     // 이미 초기화된 rendering engine이 있다면 정리
//     cleanupCornerstone();
    
//     await csInit();
//     await csToolsInit();
//     await dicomImageLoaderInit();
//     console.log('ViewportGrid: Cornerstone 초기화 완료');
//   } catch (error) {
//     console.error('Cornerstone 초기화 실패:', error);
//     throw error;
//   }
// }

// export function cleanupCornerstone() {
//   try {
//     // 활성화된 rendering engine이 있다면 제거
//     const renderingEngines = getRenderingEngines();
//     if (renderingEngines) {
//       renderingEngines.forEach(engine => {
//         if (engine && typeof engine.destroy === 'function') {
//           engine.destroy();
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Cornerstone cleanup 실패:', error);
//   }
// }
