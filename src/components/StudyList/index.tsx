// src/components/StudyList/index.tsx
import { useState, useMemo, useEffect } from "react";
import { useDicomViewer } from "@/hooks/useDicomViewer";
import { formatDate, formatTime, getMetadataValue } from "@/utils/dicomUtils";
import { DicomStudy } from "@/types/dicom";
import { StudyListTable } from "./StudyListTable";

export function StudyList() {
  const { state } = useDicomViewer();
  useEffect(() => {
    console.log("StudyList에서 받은 studies:", state.studies);
  }, [state.studies]);

  const [expandedStudyUID, setExpandedStudyUID] = useState<string | null>(null);

  const studiesArray = useMemo(
    () => (Array.isArray(state.studies) ? state.studies : []),
    [state.studies]
  );

  const tableDataSource = useMemo(() => {
    return studiesArray.map((study: DicomStudy) => {
      const isExpanded = study.studyInstanceUID === expandedStudyUID;

      const row = [
        {
          content: getMetadataValue(study.metadata, "PatientName"),
          title: getMetadataValue(study.metadata, "PatientName"),
          gridCol: 2,
        },
        {
          content: getMetadataValue(study.metadata, "PatientID"),
          title: getMetadataValue(study.metadata, "PatientID"),
          gridCol: 2,
        },
        {
          content: `${formatDate(
            getMetadataValue(study.metadata, "StudyDate")
          )} ${formatTime(getMetadataValue(study.metadata, "StudyTime"))}`,
          title: formatDate(getMetadataValue(study.metadata, "StudyDate")),
          gridCol: 2,
        },
        {
          content: getMetadataValue(study.metadata, "StudyDescription"),
          title: getMetadataValue(study.metadata, "StudyDescription"),
          gridCol: 2,
        },
        {
          content: getMetadataValue(study.metadata, "Modality"),
          title: getMetadataValue(study.metadata, "Modality"),
          gridCol: 2,
        },
        {
          content: study.imageIds?.length || 0,
          title: `${study.imageIds?.length || 0} images`,
          gridCol: 2,
        },
      ];

      const expandedContent = (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Patient Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-400">Birth Date:</span>{" "}
                  {formatDate(
                    getMetadataValue(study.metadata, "PatientBirthDate")
                  )}
                </p>
                <p>
                  <span className="text-gray-400">Sex:</span>{" "}
                  {getMetadataValue(study.metadata, "PatientSex")}
                </p>
                <p>
                  <span className="text-gray-400">Age:</span>{" "}
                  {getMetadataValue(study.metadata, "PatientAge")}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Study Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-400">Accession Number:</span>{" "}
                  {getMetadataValue(study.metadata, "AccessionNumber")}
                </p>
                <p>
                  <span className="text-gray-400">Study ID:</span>{" "}
                  {study.studyInstanceUID}
                </p>
                {/* TODO: Rendering view page로 이동하는 로직 추가 (필요하면 query까지 추가해서 진행하면 된다!) */}
                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Rendering Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      );

      return {
        row,
        expandedContent,
        onClickRow: () =>
          setExpandedStudyUID(isExpanded ? null : study.studyInstanceUID),
        isExpanded,
        dataCY: `study-row-${study.studyInstanceUID}`,
        clickableCY: `study-row-click-${study.studyInstanceUID}`,
      };
    });
  }, [studiesArray, expandedStudyUID]);

  if (studiesArray.length === 0) {
    return (
      <div className="w-full h-full bg-black p-6 flex items-center justify-center">
        <p className="text-white">No studies available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl">Study List</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Back to Info
          </button>
        </div>
        <StudyListTable tableDataSource={tableDataSource} />
      </div>
    </div>
  );
}
