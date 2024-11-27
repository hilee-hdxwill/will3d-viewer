// src/components/DicomViewer/cornerstone/cornerstoneInit.ts
import { init as csInit } from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';

const initCornerstone = async () => {
  await csInit();
  await csToolsInit();
};

export default initCornerstone;
