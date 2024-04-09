import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function CreateMessageIcon() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="20.064pt"
        height="19pt"
        viewBox="0 0 94.000000 89.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,89.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M75 871 c-11 -5 -29 -19 -40 -31 -19 -21 -20 -36 -20 -337 l0 -315
 33 -29 c30 -27 38 -29 117 -29 l84 0 3 -63 c3 -62 3 -62 36 -65 25 -3 56 11
 141 62 l109 66 167 0 c167 0 196 5 222 39 9 12 12 100 13 337 l0 321 -26 24
 -26 24 -396 2 c-218 1 -406 -2 -417 -6z m775 -371 l0 -280 -169 0 -170 0 -83
 -50 -83 -50 -3 50 -3 50 -115 0 -114 0 0 280 0 280 370 0 370 0 0 -280z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
