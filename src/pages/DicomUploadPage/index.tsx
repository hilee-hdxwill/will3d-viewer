// src/pages/DicomUploadPage/index.tsx
import Dropzone from 'react-dropzone';
import { useDicomViewer } from '@/context/DicomContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function DicomUploadPage({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const { state, loadDicomFiles } = useDicomViewer();

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      //console.log('업로드된 파일들:', acceptedFiles);
      await loadDicomFiles(acceptedFiles);
      console.log('DICOM 파일 로드 완료:', state.studies);
      onUploadSuccess();
    } catch (error) {
      console.error('DICOM 파일 로드 실패:', error);
    }
  };

  if (state.isLoading) {
    return <LoadingSpinner message="Loading DICOM files..." />;
  }

  return (
    <Dropzone onDrop={onDrop} accept={{ 'application/dicom': ['.dcm'] }}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className="flex h-full w-full items-center justify-center cursor-pointer"
        >
          <div className="bg-[#1B1C1E] mx-auto space-y-2 rounded-lg p-8 drop-shadow-md">
            <div className="space-y-2 pt-4 text-center">
              {state.error && (
                <p className="text-red-500 mb-4">
                  {state.error}
                </p>
              )}
              
              <p className="text-base text-blue-300">
                Note: Your data is not uploaded to any server, it will stay in your local
                browser application
              </p>
              
              <p className="text-xl text-blue-400 pt-6 font-semibold">
                {isDragActive
                  ? "Drop the DICOM files here..."
                  : "Drag and Drop DICOM files here to load them in the Viewer"}
              </p>
              
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('fileInput')?.click();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Load Files
                  <input
                    {...getInputProps()}
                    id="fileInput"
                    className="hidden"
                    accept=".dcm,application/dicom"
                  />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('folderInput')?.click();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Load Folders
                  <input
                    id="folderInput"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        onDrop(Array.from(e.target.files));
                      }
                    }}
                    accept=".dcm,application/dicom"
                    // @ts-expect-error directory input attributes
                    webkitdirectory=""
                    directory=""
                    multiple
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
