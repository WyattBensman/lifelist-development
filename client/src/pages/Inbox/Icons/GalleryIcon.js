import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function GalleryIcon() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="20.000000pt"
        height="20.000000pt"
        viewBox="0 0 88.000000 88.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,88.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M185 855 l-25 -24 0 -311 0 -311 25 -24 24 -25 311 0 311 0 24 25 25
24 0 311 0 311 -25 24 -24 25 -311 0 -311 0 -24 -25z m615 -335 l0 -280 -280
0 -280 0 0 280 0 280 280 0 280 0 0 -280z"
          />
          <Path
            d="M545 438 c-27 -35 -50 -65 -52 -68 -3 -2 -20 14 -39 38 -20 23 -39
42 -44 42 -4 0 -31 -29 -59 -65 l-51 -65 220 0 220 0 -67 90 c-37 50 -70 90
-74 90 -3 0 -28 -28 -54 -62z"
          />
          <Path
            d="M0 385 l0 -336 25 -24 24 -25 336 0 335 0 0 40 0 40 -320 0 -320 0 0
320 0 320 -40 0 -40 0 0 -335z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
