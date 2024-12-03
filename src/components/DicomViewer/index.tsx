// src/components/DicomViewer/index.tsx

//TODO: 특정 Study를 받아서 처리하면 된다!
export function DicomViewer() {
  return (
    <div className="w-screen h-screen bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl">DICOM Viewer</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Back to Study List
        </button>
      </div>
      {/* <ImageViewer
        studyInstanceUID={study.studyInstanceUID}
        seriesInstanceUID={study.seriesInstanceUID}
      /> */}
      {/* <Viewport study={study}/> */}
    </div>
  );
}

//ImagesId를 기반으로 input에 값을 넣으면 될듯하다!
