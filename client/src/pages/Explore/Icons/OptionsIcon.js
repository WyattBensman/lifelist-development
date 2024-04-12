import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function OptionsIcon({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24.000000pt"
        height="24.000000pt"
        viewBox="0 0 96.000000 96.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M106 534 c-34 -34 -34 -77 -1 -109 48 -49 135 -15 135 53 0 38 -43
82 -80 82 -16 0 -38 -11 -54 -26z"
          />
          <Path
            d="M426 534 c-34 -34 -34 -77 -1 -109 48 -49 135 -15 135 53 0 38 -43
82 -80 82 -16 0 -38 -11 -54 -26z"
          />
          <Path
            d="M746 534 c-34 -34 -34 -77 -1 -109 48 -49 135 -15 135 53 0 38 -43
82 -80 82 -16 0 -38 -11 -54 -26z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
