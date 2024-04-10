import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function EditLifeListIcon({ style, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="25.000000pt"
        height="25.000000pt"
        viewBox="0 0 112.000000 112.000000"
        preserveAspectRatio="xMidYMid meet"
        style={style}
      >
        <G
          transform="translate(0.000000,115.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M789 1001 c-19 -11 -104 -91 -187 -179 l-152 -160 -21 -93 c-18 -83
-18 -94 -5 -108 14 -13 25 -13 93 -2 43 7 92 19 109 27 17 8 103 88 191 177
132 134 161 168 167 199 20 108 -97 192 -195 139z m106 -85 c19 -29 12 -46
-32 -88 l-29 -28 -34 35 -34 35 34 35 c40 41 73 45 95 11z m-147 -139 l32 -33
-98 -96 c-79 -78 -104 -97 -136 -103 l-39 -6 7 43 c6 37 19 55 99 136 50 50
94 92 97 92 3 0 20 -15 38 -33z"
          />
          <Path
            d="M143 905 c-18 -8 -42 -29 -53 -47 -19 -31 -20 -50 -20 -348 0 -291 2
-317 19 -346 37 -61 56 -64 394 -64 299 0 305 0 338 23 53 35 69 77 69 184 0
70 -4 95 -16 107 -18 19 -20 19 -45 6 -17 -9 -19 -22 -19 -105 0 -144 23 -135
-333 -135 -272 0 -295 1 -310 18 -15 16 -17 53 -17 314 0 352 -9 328 126 328
57 0 94 4 102 12 17 17 15 55 -4 62 -31 12 -199 5 -231 -9z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
