// src/context/DicomContext.ts
import React, { createContext, useState } from "react";
// @ts-expect-error no type definitions
import dcmjs from "dcmjs";
import dicomImageLoader from "@cornerstonejs/dicom-image-loader";
import { DicomViewerState } from "@/types/dicom";
import { extractRenderingMetadata } from "@/utils/dicomUtils";
import { DicomMetadataStore } from "@/utils/DicomMetadataStore";

interface DicomViewerContextType {
  state: DicomViewerState;
  loadDicomFiles: (files: File[]) => Promise<void>;
  clearStudies: () => void;
}

export const DicomViewerContext = createContext<
  DicomViewerContextType | undefined
>(undefined);

class DicomFileLoader {
  addFile(file: File) {
    return dicomImageLoader.wadouri.fileManager.add(file);
  }

  async loadFile(imageId: string) {
    return dicomImageLoader.wadouri.loadFileRequest(imageId);
  }

  getDataset(image: any, imageId: string) {
    const dicomData = dcmjs.data.DicomMessage.readFile(image);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict
    );

    dataset.url = imageId;
    dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(
      dicomData.meta
    );
    dataset.AvailableTransferSyntaxUID =
      dataset.AvailableTransferSyntaxUID ||
      dataset._meta.TransferSyntaxUID?.Value?.[0];

    //return dataset;
    // 렌더링 메타데이터 추출
    const renderingMetadata = extractRenderingMetadata(dataset);

    return {
      dataset,
      renderingMetadata,
    };
  }
}

export function DicomViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

      const { dataset, renderingMetadata } = loader.getDataset(image, imageId);
      DicomMetadataStore.addInstance(dataset);

      if (dataset.StudyInstanceUID) {
        setState((prev) => {
          const existingStudyIndex = prev.studies.findIndex(
            (study) => study.studyInstanceUID === dataset.StudyInstanceUID
          );

          if (existingStudyIndex >= 0) {
            const updatedStudies = [...prev.studies];
            updatedStudies[existingStudyIndex] = {
              ...updatedStudies[existingStudyIndex],
              imageIds: [
                ...updatedStudies[existingStudyIndex].imageIds,
                imageId,
              ],
              renderingMetadata: {
                ...updatedStudies[existingStudyIndex].renderingMetadata,
                ...renderingMetadata,
              },
            };
            return { ...prev, studies: updatedStudies };
          } else {
            return {
              ...prev,
              studies: [
                ...prev.studies,
                {
                  seriesInstanceUID: dataset.SeriesInstanceUID,
                  studyInstanceUID: dataset.StudyInstanceUID,
                  sopInstanceUID: dataset.SOPInstanceUID,
                  imageIds: [imageId],
                  renderingMetadata,
                  metadata: dataset,
                },
              ],
            };
          }
        });
      }

      return dataset;
    } catch (error) {
      console.error("Error processing DICOM file:", error);
      throw error;
    }
  };

  const loadDicomFiles = async (files: File[]) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const processPromises = files.map(processFile);
      await Promise.all(processPromises);

      const studyUIDs = DicomMetadataStore.getStudyInstanceUIDs();
      console.log("📑 DicomMetadataStore uids");
      console.log(studyUIDs);

      const firstStudy = DicomMetadataStore.getStudy(studyUIDs[0]);
      console.log("📑 DicomMetadataStore firstStudy info");
      console.log(firstStudy);

      const firstSeriesUID = firstStudy.series[0].SeriesInstanceUID;
      const firstSeries = DicomMetadataStore.getSeries(
        studyUIDs[0],
        firstSeriesUID
      );
      console.log("📑 DicomMetadataStore firstSeries info");
      console.log(firstSeries);

      const firstSOPInstanceUID = firstSeries.instances[0].SOPInstanceUID;
      const firstSOPInstance = DicomMetadataStore.getInstance(
        studyUIDs[0],
        firstSeriesUID,
        firstSOPInstanceUID
      );
      console.log("📑 DicomMetadataStore firstSeriesSOPInstance info");
      console.log(firstSOPInstance);
    } catch (error: unknown) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearStudies = () => {
    setState({
      studies: [],
      isLoading: false,
      error: null,
    });
  };

  return (
    <DicomViewerContext.Provider
      value={{ state, loadDicomFiles, clearStudies }}
    >
      {children}
    </DicomViewerContext.Provider>
  );
}
