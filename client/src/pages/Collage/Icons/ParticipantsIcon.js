import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function ParticipantsIcon({ onPress, isAdmin }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 84.000000 84.000000"
        preserveAspectRatio="xMidYMid meet"
        style={isAdmin && { marginRight: 16 }}
      >
        <G
          transform="translate(0.000000,75.000000) scale(0.100000,-0.100000)"
          fill="#ffffff"
          stroke="none"
        >
          <Path
            d="M344 691 c-23 -10 -54 -36 -70 -57 -26 -33 -29 -45 -29 -110 0 -66 3
-75 32 -112 l32 -40 -39 -27 c-63 -44 -110 -126 -110 -192 0 -18 6 -23 25 -23
19 0 25 5 25 23 1 33 34 99 66 129 37 35 93 58 141 58 81 1 165 65 179 136 18
95 -22 179 -100 215 -52 24 -100 24 -152 0z m132 -51 c154 -75 48 -301 -109
-232 -102 45 -103 182 -2 232 50 25 59 25 111 0z"
          />
          <Path
            d="M516 324 c-11 -11 -16 -35 -16 -82 l0 -67 88 -88 c53 -53 95 -87 108
-87 26 0 144 121 144 147 0 10 -39 58 -88 106 l-87 87 -67 0 c-47 0 -71 -5
-82 -16z m196 -101 c38 -37 68 -72 68 -77 0 -13 -71 -86 -84 -86 -6 0 -41 30
-78 67 -65 65 -68 70 -68 115 l0 48 47 0 c45 0 51 -3 115 -67z"
          />
          <Path d="M584 245 c-4 -9 -2 -21 4 -27 15 -15 44 -1 40 19 -4 23 -36 29 -44 8z" />
        </G>
      </Svg>
    </Pressable>
  );
}
