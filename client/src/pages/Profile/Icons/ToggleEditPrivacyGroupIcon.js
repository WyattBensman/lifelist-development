import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function ToggleEditPrivacyGroupIcon({ style, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="25.000000pt"
        height="25.000000pt"
        viewBox="0 0 96.000000 96.000000"
        preserveAspectRatio="xMidYMid meet"
        onPress={onPress}
      >
        <G
          transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M675 851 c-16 -10 -87 -77 -157 -148 -132 -135 -139 -147 -154 -255
-4 -31 -2 -48 6 -53 7 -4 46 -2 89 5 l76 13 153 151 c149 149 152 153 152 195
0 36 -6 49 -34 77 -40 40 -83 45 -131 15z m89 -57 c24 -23 19 -50 -13 -86
l-30 -33 -30 29 c-38 36 -38 42 -4 78 30 32 54 35 77 12z m-122 -121 c15 -15
28 -32 28 -38 0 -17 -143 -153 -173 -164 -16 -6 -38 -11 -49 -11 -18 0 -19 4
-13 38 5 29 25 55 88 120 45 45 84 82 86 82 3 0 18 -12 33 -27z"
          />
          <Path
            d="M133 775 c-18 -8 -42 -29 -53 -47 -19 -31 -20 -50 -20 -286 0 -280 5
-309 59 -336 25 -13 74 -16 291 -16 291 0 305 3 335 66 20 44 21 177 0 194
-32 27 -45 5 -45 -77 0 -130 17 -123 -290 -123 -256 0 -259 0 -274 22 -13 19
-16 62 -16 266 0 149 4 251 10 263 9 16 22 19 83 19 40 0 82 3 95 6 24 7 29
33 10 52 -17 17 -145 15 -185 -3z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
