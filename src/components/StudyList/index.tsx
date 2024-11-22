// src/components/StudyList/index.tsx
import { useState, useMemo } from 'react';
import { useDicomViewer } from '@/context/DicomContext';
import { formatDate, formatTime, getMetadataValue } from '@/utils/dicomUtils';
import { DicomStudy } from '@/types/dicom';
import { StudyListTable } from './StudyListTable';

interface StudyListProps {
  onBack: () => void;
  onViewImages: (studyInstanceUID: string) => void;
}

export function StudyList({ onBack, onViewImages }: StudyListProps) {
  const { state } = useDicomViewer();
  const [expandedStudyUID, setExpandedStudyUID] = useState<string | null>(null);
  const studiesArray = Array.isArray(state.studies) ? state.studies : [];

  const tableDataSource = useMemo(() => {
    return studiesArray.map((study: DicomStudy) => {
      const isExpanded = study.studyInstanceUID === expandedStudyUID;
      
      const row = [
        {
          content: getMetadataValue(study.metadata, 'PatientName'),
          title: getMetadataValue(study.metadata, 'PatientName'),
          gridCol: 2
        },
        {
          content: getMetadataValue(study.metadata, 'PatientID'),
          title: getMetadataValue(study.metadata, 'PatientID'),
          gridCol: 2
        },
        {
          content: `${formatDate(getMetadataValue(study.metadata, 'StudyDate'))} ${formatTime(
            getMetadataValue(study.metadata, 'StudyTime')
          )}`,
          title: formatDate(getMetadataValue(study.metadata, 'StudyDate')),
          gridCol: 2
        },
        {
          content: getMetadataValue(study.metadata, 'StudyDescription'),
          title: getMetadataValue(study.metadata, 'StudyDescription'),
          gridCol: 2
        },
        {
          content: getMetadataValue(study.metadata, 'Modality'),
          title: getMetadataValue(study.metadata, 'Modality'),
          gridCol: 2
        },
        {
          content: study.imageIds?.length || 0,
          title: `${study.imageIds?.length || 0} images`,
          gridCol: 2
        }
      ];

      const expandedContent = (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Patient Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-400">Birth Date:</span>{' '}
                  {formatDate(getMetadataValue(study.metadata, 'PatientBirthDate'))}
                </p>
                <p>
                  <span className="text-gray-400">Sex:</span>{' '}
                  {getMetadataValue(study.metadata, 'PatientSex')}
                </p>
                <p>
                  <span className="text-gray-400">Age:</span>{' '}
                  {getMetadataValue(study.metadata, 'PatientAge')}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Study Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-400">Accession Number:</span>{' '}
                  {getMetadataValue(study.metadata, 'AccessionNumber')}
                </p>
                <p>
                  <span className="text-gray-400">Study ID:</span>{' '}
                  {study.studyInstanceUID}
                </p>
                <button
                  onClick={() => onViewImages(study.studyInstanceUID)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
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
        onClickRow: () => setExpandedStudyUID(isExpanded ? null : study.studyInstanceUID),
        isExpanded,
        dataCY: `study-row-${study.studyInstanceUID}`,
        clickableCY: `study-row-click-${study.studyInstanceUID}`
      };
    });
  }, [studiesArray, expandedStudyUID, onViewImages]);

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
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Info
          </button>
        </div>
        <StudyListTable tableDataSource={tableDataSource} />
      </div>
    </div>
  );
}
