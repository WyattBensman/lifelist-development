import { TouchableOpacity } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function ListViewIcon({ style, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="20.000000pt"
        viewBox="0 0 88.000000 68.000000"
        preserveAspectRatio="xMidYMid meet"
        style={style}
      >
        <G
          transform="translate(0.000000,70.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M16 634 c-19 -19 -20 -44 -4 -67 12 -16 47 -17 427 -15 402 3 414 4
427 23 11 16 11 25 1 45 l-13 25 -411 3 c-364 2 -413 0 -427 -14z"
          />
          <Path
            d="M16 354 c-19 -19 -20 -44 -4 -67 12 -16 47 -17 427 -15 402 3 414 4
427 23 11 16 11 25 1 45 l-13 25 -411 3 c-364 2 -413 0 -427 -14z"
          />
          <Path
            d="M16 74 c-17 -16 -20 -33 -10 -58 5 -14 53 -16 430 -16 399 0 424 1
433 18 7 12 6 26 -2 43 l-13 24 -411 3 c-364 2 -413 0 -427 -14z"
          />
        </G>
      </Svg>
    </TouchableOpacity>
  );
}
