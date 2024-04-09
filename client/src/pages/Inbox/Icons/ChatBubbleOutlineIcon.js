import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function ChatBubbleOutlineIcon() {
  return (
    <Pressable>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24.000000pt"
        height="24.000000pt"
        viewBox="0 0 96.000000 96.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M105 855 l-25 -24 0 -378 0 -378 83 83 82 82 293 0 293 0 24 25 25
 24 0 271 0 271 -25 24 -24 25 -351 0 -351 0 -24 -25z m695 -295 l0 -240 -277
 0 -277 0 -43 -42 -43 -42 0 282 0 282 320 0 320 0 0 -240z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
