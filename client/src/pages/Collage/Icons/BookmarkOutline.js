import Svg, { Path, G } from "react-native-svg";

export default function BookmarkOutline() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 96.000000 96.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginRight: 12 }}
    >
      <G
        transform="translate(0.000000,86.000000) scale(0.100000,-0.100000)"
        fill="#ffffff"
        stroke="none"
      >
        <Path
          d="M230 810 c-19 -19 -20 -33 -20 -350 l0 -329 68 29 c37 16 98 42 136
58 l69 29 133 -58 134 -58 0 330 c0 316 -1 330 -20 349 -19 19 -33 20 -250 20
-217 0 -231 -1 -250 -20z m460 -311 c0 -213 -3 -270 -12 -266 -7 3 -54 24
-105 46 l-92 40 -102 -44 c-56 -25 -103 -45 -105 -45 -2 0 -4 122 -4 270 l0
270 210 0 210 0 0 -271z"
        />
      </G>
    </Svg>
  );
}
