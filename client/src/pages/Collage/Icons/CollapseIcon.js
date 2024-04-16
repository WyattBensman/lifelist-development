import Svg, { Path, G } from "react-native-svg";

export default function CollapseIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="22.27"
      height="17.5"
      viewBox="0 0 84.000000 66.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginRight: 8 }}
    >
      <G
        transform="translate(0.000000,66.000000) scale(0.100000,-0.100000)"
        fill="#ffffff"
        stroke="none"
      >
        <Path
          d="M44 605 c-4 -8 -4 -22 0 -30 5 -13 59 -15 401 -15 l395 0 0 30 0 30
-395 0 c-342 0 -396 -2 -401 -15z"
        />
        <Path
          d="M433 443 c-10 -3 -13 -49 -13 -181 l0 -176 -69 68 c-61 61 -71 67
-90 57 -11 -7 -21 -17 -21 -24 0 -6 39 -51 87 -99 81 -82 90 -88 128 -88 37 0
47 6 123 83 82 82 93 102 70 125 -19 19 -26 15 -94 -50 l-64 -61 0 157 c0 183
-8 209 -57 189z"
        />
      </G>
    </Svg>
  );
}
