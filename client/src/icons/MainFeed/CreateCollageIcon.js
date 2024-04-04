import Svg, { Path, G } from "react-native-svg";
import { StyleSheet } from "react-native";

export default function CreateCollageIcon({ style }) {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="28.000000pt"
      height="28.000000pt"
      viewBox="0 0 128.000000 128.000000"
      preserveAspectRatio="xMidYMid meet"
      style={style}
    >
      <G
        transform="translate(0.000000,135.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M487 1165 c-124 -34 -249 -129 -316 -239 -121 -202 -86 -474 83 -641
209 -207 534 -207 741 0 101 101 155 231 155 375 0 230 -167 446 -391 505 -66
18 -207 18 -272 0z m326 -92 c76 -36 166 -116 204 -181 130 -221 54 -506 -168
-635 -135 -78 -323 -75 -461 6 -65 38 -145 128 -181 204 -30 65 -32 74 -32
189 0 119 0 121 38 197 60 121 152 200 282 243 26 9 78 13 145 11 94 -2 112
-6 173 -34z"
        />
        <Path
          d="M607 859 c-14 -8 -17 -25 -17 -89 l0 -80 -80 0 c-64 0 -81 -3 -89
-17 -6 -11 -6 -24 0 -35 8 -15 23 -18 89 -18 l79 0 3 -82 3 -83 30 0 30 0 3
83 3 82 72 0 c83 0 100 8 95 41 -3 23 -7 24 -85 27 l-83 3 0 79 c0 66 -3 81
-18 89 -11 6 -24 6 -35 0z"
        />
      </G>
    </Svg>
  );
}
