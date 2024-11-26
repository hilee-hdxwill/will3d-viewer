// src/context/DicomContext.ts
import React, { createContext, useContext, useState } from 'react';
// @ts-expect-error no type definitions
import dcmjs from 'dcmjs';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import { DicomViewerState } from '@/types/dicom';
//import { DicomMetadataStore } from '@ohif/core';

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

  async loadFile(imageId: string) {
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
      const image = await loader.loadFile(imageId);
      const dataset = loader.getDataset(image, imageId);
      //DicomMetadataStore.addInstance(dataset);

      if (dataset.StudyInstanceUID) {
        setState(prev => {
          const existingStudyIndex = prev.studies.findIndex(
            study => study.studyInstanceUID === dataset.StudyInstanceUID
          );

          if (existingStudyIndex >= 0) {
            const updatedStudies = [...prev.studies];
            updatedStudies[existingStudyIndex] = {
              ...updatedStudies[existingStudyIndex],
              imageIds: [...updatedStudies[existingStudyIndex].imageIds, imageId],
            };
            return { ...prev, studies: updatedStudies };
          } else {
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
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
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
