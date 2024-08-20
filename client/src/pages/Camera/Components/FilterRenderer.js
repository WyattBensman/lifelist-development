import React, { useRef, useEffect } from "react";
import { captureRef } from "react-native-view-shot";
import { shaders } from "../../../utils/cameraUtils/shaders";
import FilteredImage from "./FilteredImage";

export default function FilterRenderer({ imageUri, cameraType, onCapture }) {
  const filterRef = useRef(null);

  useEffect(() => {
    const applyFilter = async () => {
      try {
        let selectedShader;
        switch (cameraType) {
          case "Standard":
            selectedShader = shaders.standardFilter;
            break;
          case "Disposable":
            selectedShader = shaders.disposableFilter;
            break;
          case "Fuji":
            selectedShader = shaders.fujiFilter;
            break;
          default:
            selectedShader = shaders.standardFilter;
        }

        const filterOutputUri = await captureRef(filterRef.current, {
          format: "jpg",
          quality: 1,
          result: "tmpfile",
        });

        onCapture(filterOutputUri);
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    };

    applyFilter();
  }, [cameraType, imageUri]);

  return (
    <FilteredImage
      ref={filterRef}
      image={imageUri}
      shader={shaders[cameraType]}
    />
  );
}
