import { DicomViewerContext } from "@/context/DicomContext";
import { useContext } from "react";

export const useDicomViewer = () => {
  const context = useContext(DicomViewerContext);
  if (context === undefined) {
    throw new Error("useDicomViewer must be used within a DicomViewerProvider");
  }
  return context;
};
