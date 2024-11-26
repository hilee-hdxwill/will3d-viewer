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
        // Clear cache before loading new study
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
