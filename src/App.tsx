// App.tsx
import Local from './components/Local'
import { DicomViewerProvider } from './components/DicomViewer/DicomViewerContext'

function App() {
  return (
    <DicomViewerProvider>
      <div className="w-screen h-screen bg-black">
        <Local />
      </div>
    </DicomViewerProvider>
  )
}

export default App
