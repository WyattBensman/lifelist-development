import Svg, { Path, G } from "react-native-svg";

export default function CreateConversationIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="24.000000pt"
      height="24.000000pt"
      viewBox="0 0 112.000000 112.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginTop: 4 }}
    >
      <G
        transform="translate(0.000000,112.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M155 1021 c-11 -5 -29 -19 -40 -31 -19 -21 -20 -36 -20 -337 l0 -315
33 -29 c30 -27 38 -29 117 -29 l85 0 0 -58 c0 -58 11 -82 39 -82 8 0 68 31
132 70 l117 70 166 0 c102 0 175 4 190 11 53 25 57 51 54 379 l-3 300 -28 27
-27 28 -398 2 c-218 1 -406 -2 -417 -6z m775 -371 l0 -280 -169 0 -170 0 -83
-50 -83 -50 -3 50 -3 50 -115 0 -114 0 0 280 0 280 370 0 370 0 0 -280z"
        />
        <Path
          d="M632 807 l-22 -23 33 -32 33 -32 24 25 24 25 -29 30 c-35 36 -36 36
-63 7z"
        />
        <Path
          d="M487 662 c-73 -74 -87 -92 -87 -120 0 -30 3 -32 33 -32 28 0 46 13
122 90 l89 90 -29 30 c-16 16 -31 30 -35 30 -3 0 -45 -39 -93 -88z"
        />
      </G>
    </Svg>
  );
}
