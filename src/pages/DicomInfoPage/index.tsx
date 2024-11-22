// src/pages/DicomInfoPage/index.tsx
import { DicomMetadataViewer } from '@/components/DicomMetadataViewer';

interface DicomInfoPageProps {
  onStudyListClick: () => void;
}

export function DicomInfoPage({ onStudyListClick }: DicomInfoPageProps) {
  return <DicomMetadataViewer onStudyListClick={onStudyListClick} />;
}
