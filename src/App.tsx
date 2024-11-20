// App.tsx
import Local from './components/Local'
import { DicomViewerProvider } from './contexts/DicomViewerContext'

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
