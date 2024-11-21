// src/App.tsx
import { DicomViewerProvider } from './context/DicomContext';
import { MainViewer } from './components/MainViewer';

function App() {
  return (
    <DicomViewerProvider>
      <div className="w-screen h-screen bg-black">
        <MainViewer />
      </div>
    </DicomViewerProvider>
  );
}

export default App;
