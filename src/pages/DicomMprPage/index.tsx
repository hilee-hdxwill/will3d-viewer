// src/pages/DicomMprPage/index.tsx
import { MprViewer } from '../../components/MprViewer';

interface DicomMprPageProps {
  onBack: () => void;
}

export function DicomMprPage({ onBack }: DicomMprPageProps) {
  return (
    <div className="w-full h-full">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onBack}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
        >
          Back to Metadata
        </button>
      </div>
      <MprViewer />
    </div>
  );
}
