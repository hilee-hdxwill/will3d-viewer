import React, { useEffect, useRef, useState } from 'react';
import {
  init as coreInit,
  RenderingEngine,
  Enums,
  volumeLoader,
  setVolumesForViewports,
  metaData,
  Types,
  cache,
} from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import { DicomStudy } from '@/types/dicom';
import { DicomMetadataStore } from '@/utils/DicomMetadataStore';

const { ViewportType } = Enums;

interface ViewportProps {
  study: DicomStudy;
}

export const Viewport: React.FC<ViewportProps> = ({ study }) => {
  const element1Ref = useRef<HTMLDivElement>(null);
  const element2Ref = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initializeCornerstone = async () => {
      try {
        // Initialize only once
        if (!isInitialized) {
          await coreInit();
          await dicomImageLoaderInit();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeCornerstone();
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || !study.imageIds || study.imageIds.length === 0) {
      return;
    }

    const setupViewport = async () => {
      try {
        console.log('📑 DicomMetadataStore');
        // 1. 모든 StudyInstanceUID 목록 확인
        const studyUIDs = DicomMetadataStore.getStudyInstanceUIDs();
        console.log('All Study UIDs:', studyUIDs);

        // 2. 첫 번째 Study의 전체 정보 확인
        if (studyUIDs.length > 0) {
          const firstStudy = DicomMetadataStore.getStudy(studyUIDs[0]);
          console.log('First Study Details:', {
              StudyInstanceUID: firstStudy.StudyInstanceUID,
              PatientName: firstStudy.PatientName,
              StudyDate: firstStudy.StudyDate,
              NumberOfSeries: firstStudy.series.length
          });

          // 3. 첫 번째 Study의 모든 Series 정보 확인
          firstStudy.series.forEach(series => {
              console.log('Series Info:', {
                  SeriesInstanceUID: series.SeriesInstanceUID,
                  SeriesNumber: series.SeriesNumber,
                  Modality: series.Modality,
                  NumberOfInstances: series.instances.length
              });

              // 4. 각 Series의 첫 번째 Instance 정보 확인
              if (series.instances.length > 0) {
                  console.log('First Instance in Series:', {
                      SOPInstanceUID: series.instances[0].SOPInstanceUID,
                      ImageId: series.instances[0].imageId,
                      Rows: series.instances[0].Rows,
                      Columns: series.instances[0].Columns
                  });
              }
          });
        }
        // // Clear cache before loading new study
        // console.log('📑 Rendering Metadata for Study:', {
        //   studyInstanceUID: study.studyInstanceUID,
        //   imageCount: study.imageIds.length,
        //   renderingMetadata: {
        //     // 이미지 데이터 관련
        //     dimensions: {
        //       rows: study.renderingMetadata.rows,
        //       columns: study.renderingMetadata.columns,
        //     },
        //     pixelData: {
        //       bitsAllocated: study.renderingMetadata.bitsAllocated,
        //       bitsStored: study.renderingMetadata.bitsStored,
        //       highBit: study.renderingMetadata.highBit,
        //       pixelRepresentation: study.renderingMetadata.pixelRepresentation,
        //     },
        //     // 이미지 표시 관련
        //     windowSettings: {
        //       windowCenter: study.renderingMetadata.windowCenter,
        //       windowWidth: study.renderingMetadata.windowWidth,
        //       rescaleIntercept: study.renderingMetadata.rescaleIntercept,
        //       rescaleSlope: study.renderingMetadata.rescaleSlope,
        //     },
        //     // 3D 볼륨 관련
        //     volumeData: {
        //       imagePosition: study.renderingMetadata.imagePosition,
        //       imageOrientation: study.renderingMetadata.imageOrientation,
        //       pixelSpacing: study.renderingMetadata.pixelSpacing,
        //       sliceThickness: study.renderingMetadata.sliceThickness,
        //       spacingBetweenSlices: study.renderingMetadata.spacingBetweenSlices,
        //     },
        //     photometricInterpretation: study.renderingMetadata.photometricInterpretation,
        //   }
        // });
        cache.purgeCache();

        // Register metadata provider
        metaData.addProvider((type: string, imageId: string) => {
          const metadata = study.metadata;
          const index = study.imageIds.indexOf(imageId);
          
          if (index === -1) return undefined;

          switch (type) {
            case 'imagePixelModule':
              return {
                bitsAllocated: metadata.BitsAllocated || 16,
                bitsStored: metadata.BitsStored || 16,
                samplesPerPixel: metadata.SamplesPerPixel || 1,
                highBit: metadata.HighBit || 15,
                photometricInterpretation: metadata.PhotometricInterpretation || 'MONOCHROME2',
                pixelRepresentation: metadata.PixelRepresentation || 0,
                rows: metadata.Rows || 512,
                columns: metadata.Columns || 512,
              };

            case 'imagePlaneModule':
              return {
                imageOrientationPatient: metadata.ImageOrientationPatient || [1, 0, 0, 0, 1, 0],
                imagePositionPatient: [0, 0, index * (metadata.SliceThickness || 1.0)],
                pixelSpacing: metadata.PixelSpacing || [1, 1],
                sliceThickness: metadata.SliceThickness || 1.0,
                sliceLocation: index * (metadata.SliceThickness || 1.0),
              };

            default:
              return undefined;
          }
        });

        // Create and setup rendering engine
        const renderingEngineId = `engine-${study.studyInstanceUID}`;
        const renderingEngine = new RenderingEngine(renderingEngineId);

        if (!element1Ref.current || !element2Ref.current) {
          throw new Error('Viewport elements not found');
        }

        // Setup viewports
        const viewportInputArray: Types.PublicViewportInput[] = [
          {
            viewportId: 'CT_AXIAL',
            element: element1Ref.current,
            type: ViewportType.ORTHOGRAPHIC,
            defaultOptions: {
              orientation: Enums.OrientationAxis.AXIAL,
              background: [0, 0, 0],
            },
          },
          {
            viewportId: 'CT_SAGITTAL',
            element: element2Ref.current,
            type: ViewportType.ORTHOGRAPHIC,
            defaultOptions: {
              orientation: Enums.OrientationAxis.SAGITTAL,
              background: [0, 0, 0],
            },
          },
        ];

        await renderingEngine.setViewports(viewportInputArray);

        // Create and load volume
        const volumeId = `volume-${study.studyInstanceUID}`;
        const volume = await volumeLoader.createAndCacheVolume(volumeId, {
          imageIds: study.imageIds,
        });

        await volume.load();

        // Set volumes for viewports
        await setVolumesForViewports(
          renderingEngine,
          [{ volumeId }],
          ['CT_AXIAL', 'CT_SAGITTAL']
        );

        // Render
        renderingEngine.render();

        // Cleanup function
        return () => {
          renderingEngine.destroy();
        };
      } catch (error) {
        console.error('Viewport setup error:', error);
      }
    };

    setupViewport();
  }, [study, isInitialized]);

  return (
    <div className="flex flex-row gap-4 justify-center">
      <div
        ref={element1Ref}
        className="w-[500px] h-[500px] bg-gray-900"
        data-cy="axial-viewport"
      />
      <div
        ref={element2Ref}
        className="w-[500px] h-[500px] bg-gray-900"
        data-cy="sagittal-viewport"
      />
    </div>
  );
};

export default Viewport;
