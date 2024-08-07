import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function RepostIcon({ color }) {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="26.5"
      height="26.5"
      viewBox="0 0 88.000000 88.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginRight: 12 }}
    >
      <G
        transform="translate(0.000000,75.000000) scale(0.100000,-0.100000)"
        fill="#ffffff"
        stroke="none"
      >
        <Path
          d="M170 670 c-18 -18 -20 -33 -20 -175 l0 -155 -55 0 c-30 0 -55 -4 -55
-8 0 -11 124 -132 136 -132 11 0 134 122 134 133 0 4 -22 7 -50 7 l-50 0 0
145 0 145 158 0 158 0 29 30 29 30 -197 0 c-184 0 -198 -1 -217 -20z"
        />
        <Path
          d="M632 617 c-34 -34 -62 -66 -62 -70 0 -4 23 -7 50 -7 l50 0 0 -145 0
-145 -158 0 -158 0 -29 -30 -29 -30 197 0 c255 0 237 -14 237 195 l0 155 57 0
57 0 -69 70 c-38 39 -72 70 -75 70 -3 0 -34 -28 -68 -63z"
        />
      </G>
    </Svg>
  );
}
