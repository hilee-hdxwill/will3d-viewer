// src/components/DicomViewer/cornerstone/cornerstoneInit.ts
import { init as csInit, getRenderingEngine } from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';

export async function initCornerstone() {
  try {
    await csInit();
    await csToolsInit();
    
    console.log('Cornerstone 초기화 완료');
  } catch (error) {
    console.error('Cornerstone 초기화 실패:', error);
    throw error;
  }
}

export function cleanupCornerstone() {
  // 활성화된 rendering engine이 있다면 제거
  const renderingEngine = getRenderingEngine('default');
  if (renderingEngine) {
    renderingEngine.destroy();
  }
}
