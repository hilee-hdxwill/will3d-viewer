// src/pages/DicomInfoPage/index.tsx
import { DicomMetadataViewer } from '@/components/DicomMetadataViewer';

export function DicomInfoPage({ onMPRClick }: { onMPRClick: () => void }) {
  return <DicomMetadataViewer onMPRClick={onMPRClick} />;
}
