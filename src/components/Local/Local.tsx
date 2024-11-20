// Local.tsx
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDicomViewer } from '../../contexts/DicomViewerContext';
import DicomViewer from '../DicomViewer/DicomViewer';

function Local() {
  const [isLoading, setIsLoading] = useState(false);
  const { state, loadDicomFiles } = useDicomViewer();

  const onDrop = async (acceptedFiles: File[]) => {
    setIsLoading(true);
    try {
      await loadDicomFiles(acceptedFiles);
    } catch (error) {
      console.error('Error loading DICOM files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (state.studies.length > 0) {
    return <DicomViewer />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-lg">Loading DICOM files...</div>
        </div>
      </div>
    );
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

export default Local;
