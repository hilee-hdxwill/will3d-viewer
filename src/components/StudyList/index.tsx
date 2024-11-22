// src/components/StudyList/index.tsx
import { useDicomViewer } from '@/context/DicomContext';
import { formatDate, formatTime } from '@/utils/dicomUtils';
import { DicomStudy } from '@/types/dicom';

interface StudyListProps {
 onBack: () => void;
 onViewImages: (studyInstanceUID: string) => void;
}

export function StudyList({ onBack, onViewImages }: StudyListProps) {
 const { state } = useDicomViewer();
 
 // studies가 배열인지 확인
 const studiesArray = Array.isArray(state.studies) ? state.studies : [];

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
             {studiesArray.map((study: DicomStudy) => (
               <tr 
                 key={study.studyInstanceUID}
                 className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                 onClick={() => onViewImages(study.studyInstanceUID)}
               >
                 <td className="p-4">{study.metadata?.PatientName || 'N/A'}</td>
                 <td className="p-4">{study.metadata?.PatientID || 'N/A'}</td>
                 <td className="p-4">
                   {study.metadata?.StudyDate ? formatDate(study.metadata.StudyDate) : 'N/A'}{' '}
                   {study.metadata?.StudyTime ? formatTime(study.metadata.StudyTime) : ''}
                 </td>
                 <td className="p-4">{study.metadata?.StudyDescription || 'N/A'}</td>
                 <td className="p-4">{study.metadata?.Modality || 'N/A'}</td>
                 <td className="p-4">{study.metadata?.AccessionNumber || 'N/A'}</td>
                 <td className="p-4 text-right">{study.imageIds?.length || 0}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   </div>
 );
}
