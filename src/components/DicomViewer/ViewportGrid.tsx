// // src/components/DicomViewer/ViewportGrid.tsx
// import { useRef, useEffect, useState } from 'react';
// import { getRenderingEngine } from '@cornerstonejs/core';
// import { createViewport, formatImageId } from './cornerstone/helpers';

// interface ViewportGridProps {
//   study: any;
// }

// export function ViewportGrid({ study }: ViewportGridProps) {
//   const viewportRef = useRef<HTMLDivElement>(null);
//   // 초기 이미지 인덱스는 상태로 유지하되, viewport 생성 시에는 직접 전달하지 않음
//   const [imageIndex, setImageIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!viewportRef.current || !study || !study.imageIds?.length) return;
//     setLoading(true);

//     const element = viewportRef.current;
//     const formattedImageIds = study.imageIds.map(formatImageId);

//     // initialImageIndex 제거하고 기본 설정으로 진행
//     createViewport({
//       element,
//       studyUID: study.studyInstanceUID,
//       imageIds: formattedImageIds
//     })
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('ViewportGrid: Viewport 생성 실패', error);
//         setLoading(false);
//       });

//     return () => {
//       try {
//         const engine = getRenderingEngine(study.studyInstanceUID);
//         if (engine) {
//           engine.destroy();
//         }
//       } catch (error) {
//         console.error('ViewportGrid: Cleanup error:', error);
//       }
//     };
//   }, [study]); // imageIndex 의존성 제거

//   return (
//     <div className="relative h-full w-full bg-black">
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="text-white">Loading...</div>
//         </div>
//       )}
//       <div 
//         ref={viewportRef}
//         className="h-full w-full"
//         style={{ minHeight: '400px' }}
//         data-cy="viewport-container"
//       />
//       <div className="absolute bottom-4 left-4 text-white">
//         Image: {imageIndex + 1} / {study?.imageIds?.length || 0}
//       </div>
//     </div>
//   );
// }
