import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function AddLink({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="14.00000pt"
        height="14.00000pt"
        viewBox="0 0 43.000000 43.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,43.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M187 414 c-4 -4 -7 -43 -7 -86 l0 -78 -72 0 c-84 0 -101 -8 -96 -41
3 -23 7 -24 86 -27 l82 -3 0 -79 c0 -66 3 -81 18 -89 11 -6 24 -6 35 0 14 8
17 25 17 89 l0 80 80 0 c64 0 81 3 89 17 6 11 6 24 0 35 -8 15 -23 18 -89 18
l-79 0 -3 83 c-3 79 -4 82 -28 85 -14 2 -29 0 -33 -4z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
