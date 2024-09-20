import React, { forwardRef } from "react";
import { Surface } from "gl-react-expo";
import { Node } from "gl-react";
import { Dimensions } from "react-native";

const FilteredImage = forwardRef(({ image, shader }, ref) => {
  const screenWidth = Dimensions.get("window").width;
  const height = (screenWidth * 3) / 2;

  return (
    <Surface ref={ref} style={{ width: 300, height: 450 }}>
      <Node shader={shader} uniforms={{ image }} />
    </Surface>
  );
});

export default FilteredImage;
