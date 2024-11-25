// // src/components/DicomViewer/cornerstone/helpers.ts
// import { RenderingEngine, Enums, Types, StackViewport } from '@cornerstonejs/core';

// export interface ViewportInput {
//   element: HTMLDivElement;
//   studyUID: string;
//   imageIds: string[];
// }

// export async function createViewport({ element, studyUID, imageIds }: ViewportInput) {
//   try {
//     // 새로운 렌더링 엔진 생성
//     const renderingEngine = new RenderingEngine(studyUID);

//     // 뷰포트 설정
//     const viewportInput: Types.PublicViewportInput = {
//       viewportId: studyUID,
//       element,
//       type: Enums.ViewportType.STACK,
//     };

//     // 뷰포트 활성화
//     renderingEngine.enableElement(viewportInput);

//     // 뷰포트 가져오기
//     const viewport = renderingEngine.getViewport(studyUID) as StackViewport;

//     // 이미지 로드
//     await viewport.setStack(imageIds);

//     // 렌더링
//     viewport.render();

//     return viewport;
//   } catch (error) {
//     console.error('helper: Viewport 생성 실패:', error);
//     throw error;
//   }
// }

// export function formatImageId(imageId: string): string {
//   if (imageId.includes('://')) {
//     return imageId; // 이미 프로토콜이 있는 경우
//   }
//   // 로컬 파일 경로로 가정
//   //return `dicomfile://${imageId}`;
//   return `wadouri:${imageId}`;
// }
