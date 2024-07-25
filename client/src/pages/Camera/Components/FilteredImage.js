import { Surface } from "gl-react-expo";
import GLImage from "gl-react-image";
import { shaders } from "../../../utils/shaders";

export default function FilteredImage({ source, filter }) {
  return (
    <Surface style={{ width: 300, height: 300 }}>
      <GLImage
        shader={shaders[filter]}
        source={{ uri: source }}
        resizeMode="cover"
      />
    </Surface>
  );
}
