import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function InfoIcon() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="22.000000pt"
        height="22.000000pt"
        viewBox="0 0 61.000000 61.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,61.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M225 572 c-64 -22 -109 -54 -145 -104 -108 -149 -59 -362 102 -442
 44 -22 66 -26 138 -26 72 0 94 4 138 26 104 52 151 134 152 265 0 72 -4 93
 -26 137 -64 129 -221 192 -359 144z m219 -66 c231 -135 115 -490 -151 -463
 -260 27 -303 388 -57 482 58 22 152 14 208 -19z"
          />
          <Path
            d="M300 452 c-40 -32 -1 -85 44 -60 22 12 20 55 -3 68 -15 7 -24 5 -41
 -8z"
          />
          <Path
            d="M230 315 c0 -21 5 -25 30 -25 l29 0 3 -87 3 -88 55 0 c53 0 55 1 58
 28 3 24 0 27 -27 27 l-31 0 0 85 0 85 -60 0 c-57 0 -60 -1 -60 -25z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
