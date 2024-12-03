// src/components/DicomMetadataViewer/index.tsx
import { useState } from "react";
import { useDicomViewer } from "@/hooks/useDicomViewer";
import { getMetadataValue, formatDate, formatTime } from "@/utils/dicomUtils";

interface DicomMetadataViewerProps {
  onStudyListClick: () => void;
}

export function DicomMetadataViewer({
  onStudyListClick,
}: DicomMetadataViewerProps) {
  const { state } = useDicomViewer();
  const [showDetails, setShowDetails] = useState(false);

  const studiesArray = Array.isArray(state.studies) ? state.studies : [];
  const firstStudy = studiesArray[0];
  const totalImages = studiesArray.reduce(
    (total, study) => total + (study.imageIds?.length || 0),
    0
  );

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-auto py-8">
      <div className="text-center max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl">
            DICOM Files Loaded Successfully
          </h1>
          <button
            onClick={onStudyListClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Go Study Table
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-left space-y-3">
          <p className="text-blue-300">
            Total Studies:{" "}
            <span className="text-white">{state.studies.length}</span>
          </p>
          <p className="text-blue-300">
            Total Images: <span className="text-white">{totalImages}</span>
          </p>

          {firstStudy && firstStudy.metadata && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-green-400 text-lg font-semibold mb-2">
                  First Study Information:
                </p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-blue-300">
                  Series UID:{" "}
                  <span className="text-white">
                    {firstStudy.seriesInstanceUID}
                  </span>
                </p>
                <p className="text-blue-300">
                  Study UID:{" "}
                  <span className="text-white">
                    {firstStudy.studyInstanceUID}
                  </span>
                </p>
                <p className="text-blue-300">
                  SOP UID:{" "}
                  <span className="text-white">
                    {firstStudy.sopInstanceUID}
                  </span>
                </p>
                <p className="text-blue-300">
                  Number of Images:{" "}
                  <span className="text-white">
                    {firstStudy.imageIds?.length || 0}
                  </span>
                </p>

                {showDetails && (
                  <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">
                        Patient Information:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Patient Info */}
                        <p className="text-blue-300">
                          Patient Name:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "PatientName"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient ID:{" "}
                          <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, "PatientID")}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Birth Date:{" "}
                          <span className="text-white">
                            {formatDate(
                              getMetadataValue(
                                firstStudy.metadata,
                                "PatientBirthDate"
                              )
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Sex:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "PatientSex"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient Age:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "PatientAge"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Patient Weight:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "PatientWeight"
                            )}{" "}
                            kg
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Study Information Section */}
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">
                        Study Information:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-blue-300">
                          Study Date:{" "}
                          <span className="text-white">
                            {formatDate(
                              getMetadataValue(firstStudy.metadata, "StudyDate")
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Study Time:{" "}
                          <span className="text-white">
                            {formatTime(
                              getMetadataValue(firstStudy.metadata, "StudyTime")
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Accession Number:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "AccessionNumber"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Study Description:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "StudyDescription"
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Technical Information Section */}
                    <div className="mb-6">
                      <h3 className="text-green-400 font-semibold mb-3">
                        Image Technical Information:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-blue-300">
                          Modality:{" "}
                          <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, "Modality")}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Manufacturer:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "Manufacturer"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Rows:{" "}
                          <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, "Rows")}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Columns:{" "}
                          <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, "Columns")}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Bits Allocated:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "BitsAllocated"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Bits Stored:{" "}
                          <span className="text-white">
                            {getMetadataValue(
                              firstStudy.metadata,
                              "BitsStored"
                            )}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Image Type:{" "}
                          <span className="text-white">
                            {getMetadataValue(firstStudy.metadata, "ImageType")}
                          </span>
                        </p>
                        <p className="text-blue-300">
                          Transfer Syntax:{" "}
                          <span className="text-white">
                            {firstStudy.metadata.AvailableTransferSyntaxUID ||
                              "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          console.log("Full metadata:", firstStudy.metadata)
                        }
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Log Full Metadata to Console
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
