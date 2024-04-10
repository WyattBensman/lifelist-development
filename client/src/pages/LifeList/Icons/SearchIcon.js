import Svg, { Path, G } from "react-native-svg";

export default function SearchIcon({ style }) {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="27.000000pt"
      height="27.000000pt"
      viewBox="0 0 96.000000 96.000000"
      preserveAspectRatio="xMidYMid meet"
      style={style}
    >
      <G
        transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M310 831 c-46 -15 -85 -39 -116 -73 -54 -57 -69 -95 -69 -178 0 -83
15 -121 69 -178 53 -57 101 -77 186 -77 59 0 82 4 110 21 l35 22 117 -116 118
-116 30 29 30 29 -114 116 -115 115 22 40 c29 53 30 173 3 225 -26 49 -74 98
-121 122 -43 22 -144 33 -185 19z m150 -93 c132 -67 132 -249 0 -316 -56 -28
-104 -28 -160 1 -132 66 -132 248 0 315 24 12 60 22 80 22 20 0 56 -10 80 -22z"
        />
      </G>
    </Svg>
  );
}
