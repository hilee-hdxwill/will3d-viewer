// src/pages/StudyListPage/index.tsx
import { StudyList } from '@/components/StudyList';

interface StudyListPageProps {
  onBack: () => void;
  onViewImages: (studyInstanceUID: string) => void;
}

export function StudyListPage({ onBack, onViewImages }: StudyListPageProps) {
  return (
    <StudyList 
      onBack={onBack} 
      onViewImages={onViewImages} 
    />
  );
}
