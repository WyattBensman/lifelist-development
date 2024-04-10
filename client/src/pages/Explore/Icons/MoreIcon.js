import { TouchableOpacity } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function MoreIcon({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="27.000000pt"
        height="27.000000pt"
        viewBox="0 0 96.000000 96.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M185 535 c-50 -49 -15 -135 55 -135 41 0 80 39 80 80 0 41 -39 80
-80 80 -19 0 -40 -9 -55 -25z"
          />
          <Path
            d="M425 535 c-16 -15 -25 -36 -25 -55 0 -19 9 -40 25 -55 15 -16 36 -25
55 -25 70 0 105 86 55 135 -15 16 -36 25 -55 25 -19 0 -40 -9 -55 -25z"
          />
          <Path
            d="M665 535 c-16 -15 -25 -36 -25 -55 0 -19 9 -40 25 -55 49 -50 135
-15 135 55 0 41 -39 80 -80 80 -19 0 -40 -9 -55 -25z"
          />
        </G>
      </Svg>
    </TouchableOpacity>
  );
}
