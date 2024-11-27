// src/components/DicomViewer/index.tsx
import { Viewport } from '@/components/DicomViewer/Viewport'
import ImageViewer from '@/components/DicomViewer/2DImageViewer';
import { DicomStudy } from '@/types/dicom';

export function DicomViewer({ study, onBack }: { study: DicomStudy; onBack: () => void }) {
  return (
    <div className="w-full h-full bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl">DICOM Viewer</h1>
        <button
          onClick={onBack}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Study List
        </button>
      </div>
      <ImageViewer 
        studyInstanceUID={study.studyInstanceUID}
        seriesInstanceUID={study.seriesInstanceUID}
      />
      {/* <Viewport study={study}/> */}
    </div>
  );
}
