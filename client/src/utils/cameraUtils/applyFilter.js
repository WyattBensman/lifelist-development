import React from "react";
import { View } from "react-native";
import FilterRenderer from "../../pages/Camera/Components/FilterRenderer";

export const applyFilter = (imageUri, cameraType, setFilterResult) => {
  return (
    <View style={{ position: "absolute", opacity: 0 }}>
      <FilterRenderer
        imageUri={imageUri}
        cameraType={cameraType}
        onCapture={(resultUri) => {
          setFilterResult(resultUri);
        }}
      />
    </View>
  );
};
