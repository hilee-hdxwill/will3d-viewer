// src/App.tsx
import { DicomViewerProvider } from "@/context/DicomContext";
import { BrowserRouter, Routes, Route } from "react-router";
import { DicomUploadPage } from "./pages/DicomUploadPage";
import { DicomInfoPage } from "./pages/DicomInfoPage";
import { StudyListPage } from "./pages/StudyListPage";
import { DicomViewer } from "./components/DicomViewer";

function App() {
  return (
    <DicomViewerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DicomUploadPage />} />
          <Route path="/dicomInfoPage" element={<DicomInfoPage />} />
          <Route path="/studyListPage" element={<StudyListPage />} />
          <Route path="/dicomViewer" element={<DicomViewer />} />
        </Routes>
      </BrowserRouter>
    </DicomViewerProvider>
  );
}

export default App;
