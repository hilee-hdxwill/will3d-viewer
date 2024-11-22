import { useState, useMemo } from 'react';
import { useDicomViewer } from '@/context/DicomContext';
import { formatDate, formatTime, getMetadataValue } from '@/utils/dicomUtils';
import { DicomStudy } from '@/types/dicom';

interface StudyListProps {
  onBack: () => void;
  onViewImages: (studyInstanceUID: string) => void;
}

interface FilterState {
  patientName: string;
  mrn: string;
  studyDateStart: string;
  studyDateEnd: string;
  description: string;
  modality: string;
  accessionNumber: string;
}

export function StudyList({ onBack, onViewImages }: StudyListProps) {
  const { state } = useDicomViewer();
  const [filters, setFilters] = useState<FilterState>({
    patientName: '',
    mrn: '',
    studyDateStart: '',
    studyDateEnd: '',
    description: '',
    modality: '',
    accessionNumber: '',
  });
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // studies가 배열인지 확인
  const studiesArray = Array.isArray(state.studies) ? state.studies : [];

  // 필터링된 studies
  const filteredStudies = useMemo(() => {
    return studiesArray.filter((study: DicomStudy) => {
      const patientName = getMetadataValue(study.metadata, 'PatientName').toLowerCase();
      const mrn = getMetadataValue(study.metadata, 'PatientID').toLowerCase();
      const studyDate = getMetadataValue(study.metadata, 'StudyDate');
      const description = getMetadataValue(study.metadata, 'StudyDescription').toLowerCase();
      const modality = getMetadataValue(study.metadata, 'Modality').toLowerCase();
      const accessionNumber = getMetadataValue(study.metadata, 'AccessionNumber').toLowerCase();

      return (
        patientName.includes(filters.patientName.toLowerCase()) &&
        mrn.includes(filters.mrn.toLowerCase()) &&
        (!filters.studyDateStart || studyDate >= filters.studyDateStart) &&
        (!filters.studyDateEnd || studyDate <= filters.studyDateEnd) &&
        description.includes(filters.description.toLowerCase()) &&
        modality.includes(filters.modality.toLowerCase()) &&
        accessionNumber.includes(filters.accessionNumber.toLowerCase())
      );
    });
  }, [studiesArray, filters]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredStudies.length / resultsPerPage);
  const paginatedStudies = filteredStudies.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

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
          <div className="flex items-center gap-4">
            <span className="text-white">
              {filteredStudies.length} Studies
            </span>
            <button
              onClick={() => setFilters({
                patientName: '',
                mrn: '',
                studyDateStart: '',
                studyDateEnd: '',
                description: '',
                modality: '',
                accessionNumber: '',
              })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
            <button
              onClick={onBack}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Info
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={filters.patientName}
            onChange={(e) => handleFilterChange('patientName', e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          />
          <input
            type="text"
            placeholder="MRN"
            value={filters.mrn}
            onChange={(e) => handleFilterChange('mrn', e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.studyDateStart}
              onChange={(e) => handleFilterChange('studyDateStart', e.target.value)}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
            <input
              type="date"
              value={filters.studyDateEnd}
              onChange={(e) => handleFilterChange('studyDateEnd', e.target.value)}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Description"
            value={filters.description}
            onChange={(e) => handleFilterChange('description', e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          />
          <input
            type="text"
            placeholder="Modality"
            value={filters.modality}
            onChange={(e) => handleFilterChange('modality', e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          />
          <input
            type="text"
            placeholder="Accession #"
            value={filters.accessionNumber}
            onChange={(e) => handleFilterChange('accessionNumber', e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left">Patient Name</th>
                <th className="p-4 text-left">MRN</th>
                <th className="p-4 text-left">Study Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Modality</th>
                <th className="p-4 text-left">Accession #</th>
                <th className="p-4 text-right">Instances</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudies.map((study: DicomStudy) => (
                <tr
                  key={study.studyInstanceUID}
                  className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                  onClick={() => onViewImages(study.studyInstanceUID)}
                >
                  <td className="p-4">{getMetadataValue(study.metadata, 'PatientName')}</td>
                  <td className="p-4">{getMetadataValue(study.metadata, 'PatientID')}</td>
                  <td className="p-4">
                    {formatDate(getMetadataValue(study.metadata, 'StudyDate'))}{' '}
                    {formatTime(getMetadataValue(study.metadata, 'StudyTime'))}
                  </td>
                  <td className="p-4">{getMetadataValue(study.metadata, 'StudyDescription')}</td>
                  <td className="p-4">{getMetadataValue(study.metadata, 'Modality')}</td>
                  <td className="p-4">{getMetadataValue(study.metadata, 'AccessionNumber')}</td>
                  <td className="p-4 text-right">{study.imageIds?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <select
              value={resultsPerPage}
              onChange={(e) => {
                setResultsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span className="text-white">
              Showing {((currentPage - 1) * resultsPerPage) + 1} - {Math.min(currentPage * resultsPerPage, filteredStudies.length)} of {filteredStudies.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            <span className="text-white flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
