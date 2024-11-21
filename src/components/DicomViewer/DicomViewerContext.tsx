// components/DicomViewer/DicomViewerContext.tsx
import React, { createContext, useContext, useState } from 'react';
// @ts-expect-error no type definitions
import dcmjs from 'dcmjs';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

interface Study {
  studyInstanceUID: string;
  imageIds: string[];
  metadata?: any;
}

interface DicomViewerState {
  studies: Study[];
  isLoading: boolean;
  error: string | null;
}

interface DicomViewerContextType {
  state: DicomViewerState;
  loadDicomFiles: (files: File[]) => Promise<void>;
  clearStudies: () => void;
}

const DicomViewerContext = createContext<DicomViewerContextType | undefined>(undefined);

class DicomFileLoader {
  addFile(file: File) {
    return dicomImageLoader.wadouri.fileManager.add(file);
  }

  async loadFile(file: File, imageId: string) {
    return dicomImageLoader.wadouri.loadFileRequest(imageId);
  }

  getDataset(image: any, imageId: string) {
    const dicomData = dcmjs.data.DicomMessage.readFile(image);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
    
    dataset.url = imageId;
    dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);
    dataset.AvailableTransferSyntaxUID =
      dataset.AvailableTransferSyntaxUID || dataset._meta.TransferSyntaxUID?.Value?.[0];

    return dataset;
  }
}

export function DicomViewerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DicomViewerState>({
    studies: [],
    isLoading: false,
    error: null,
  });

  const processFile = async (file: File) => {
    try {
      const loader = new DicomFileLoader();
      const imageId = loader.addFile(file);
      const image = await loader.loadFile(file, imageId);
      const dataset = loader.getDataset(image, imageId);
      
      if (dataset.StudyInstanceUID) {
        // 기존 study를 찾거나 새로 생성
        setState(prev => {
          const existingStudyIndex = prev.studies.findIndex(
            study => study.studyInstanceUID === dataset.StudyInstanceUID
          );

          if (existingStudyIndex >= 0) {
            // 기존 study에 imageId 추가
            const updatedStudies = [...prev.studies];
            updatedStudies[existingStudyIndex] = {
              ...updatedStudies[existingStudyIndex],
              imageIds: [...updatedStudies[existingStudyIndex].imageIds, imageId],
            };
            return { ...prev, studies: updatedStudies };
          } else {
            // 새로운 study 생성
            return {
              ...prev,
              studies: [...prev.studies, {
                studyInstanceUID: dataset.StudyInstanceUID,
                imageIds: [imageId],
                metadata: dataset
              }],
            };
          }
        });
      }

      return dataset;
    } catch (error) {
      console.error('Error processing DICOM file:', error);
      throw error;
    }
  };

  const loadDicomFiles = async (files: File[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const processPromises = files.map(processFile);
      await Promise.all(processPromises);
    } catch (error: unknown) {
      console.error(error);

    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearStudies = () => {
    setState({
      studies: [],
      isLoading: false,
      error: null
    });
  };

  return (
    <DicomViewerContext.Provider value={{ state, loadDicomFiles, clearStudies }}>
      {children}
    </DicomViewerContext.Provider>
  );
}

export function useDicomViewer() {
  const context = useContext(DicomViewerContext);
  if (context === undefined) {
    throw new Error('useDicomViewer must be used within a DicomViewerProvider');
  }
  return context;
}
