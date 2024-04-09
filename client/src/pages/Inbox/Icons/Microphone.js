import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function Microphone() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="24.43pt"
        viewBox="0 0 56.000000 76.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,76.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M235 751 c-11 -5 -31 -21 -45 -36 -25 -26 -25 -29 -25 -196 l0 -169
 33 -32 c28 -28 39 -33 82 -33 43 0 54 5 82 33 l33 32 0 170 0 170 -31 31 c-33
 33 -92 46 -129 30z m85 -80 c13 -26 13 -276 0 -302 -14 -26 -66 -26 -80 0 -5
 11 -10 79 -10 151 0 72 5 140 10 151 7 12 21 19 40 19 19 0 33 -7 40 -19z"
          />
          <Path
            d="M0 382 c0 -86 95 -206 188 -236 l52 -18 0 -64 0 -64 40 0 40 0 0 64
 0 64 49 17 c91 30 171 122 186 213 l7 42 -36 0 c-32 0 -36 -3 -36 -25 0 -33
 -31 -94 -62 -121 -79 -72 -220 -73 -296 -1 -31 29 -62 90 -62 122 0 22 -4 25
 -35 25 -27 0 -35 -4 -35 -18z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
