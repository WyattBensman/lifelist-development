import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function SearchIcon() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24.000000pt"
        height="24.000000pt"
        viewBox="0 -2 96.000000 96.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M304 872 c-93 -33 -166 -100 -207 -189 -17 -38 -22 -67 -22 -133 0
-76 3 -92 33 -152 36 -73 87 -124 161 -160 38 -19 63 -23 142 -23 89 0 100 2
159 33 l64 33 107 -107 c88 -87 110 -105 128 -99 11 3 21 14 21 23 0 9 -47 64
-105 122 l-106 106 33 64 c31 59 33 70 33 159 -1 108 -17 155 -81 229 -79 92
-244 136 -360 94z m221 -76 c56 -26 119 -90 143 -145 8 -20 15 -65 15 -101 1
-158 -116 -275 -272 -273 -78 0 -125 19 -183 71 -145 131 -107 370 72 451 64
29 159 28 225 -3z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
