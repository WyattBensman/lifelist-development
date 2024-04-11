import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function MoreIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="80.000000pt"
      height="60.000000pt"
      viewBox="0 0 80.000000 60.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G
        transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M22 578 c-15 -15 -15 -61 0 -76 17 -17 739 -17 756 0 15 15 15 61 0
76 -17 17 -739 17 -756 0z"
        />
        <Path
          d="M22 338 c-15 -15 -15 -61 0 -76 17 -17 739 -17 756 0 15 15 15 61 0
76 -17 17 -739 17 -756 0z"
        />
        <Path
          d="M22 98 c-15 -15 -15 -61 0 -76 17 -17 739 -17 756 0 15 15 15 61 0
76 -17 17 -739 17 -756 0z"
        />
      </G>
    </Svg>
  );
}
