import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function DownArrow() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="25.000000pt"
      height="25.000000pt"
      viewBox="0 0 176.000000 176.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G
        transform="translate(0.000000,176.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M560 1040 c-43 -43 -41 -46 187 -260 l153 -142 167 157 c93 86 174
165 182 175 30 43 -21 106 -68 84 -11 -5 -76 -62 -145 -126 -68 -65 -131 -118
-139 -118 -8 0 -21 7 -28 17 -45 54 -251 233 -269 233 -11 0 -29 -9 -40 -20z"
        />
      </G>
    </Svg>
  );
}
