import Svg, { Path, G } from "react-native-svg";

export default function PinIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="13.50000pt"
      height="13.50000pt"
      viewBox="0 0 56.000000 56.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginTop: 3, marginRight: 3 }}
    >
      <G
        transform="translate(5.000000,56.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M209 469 c-47 -27 -72 -72 -72 -126 0 -35 11 -62 66 -150 36 -60 71
-108 77 -108 6 0 41 48 77 108 55 88 66 115 66 150 0 56 -28 104 -75 128 -48
25 -94 24 -139 -2z m109 -75 c34 -23 27 -83 -10 -104 -25 -13 -31 -13 -55 0
-38 21 -45 81 -11 104 12 9 29 16 38 16 9 0 26 -7 38 -16z"
        />
      </G>
    </Svg>
  );
}
