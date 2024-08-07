import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function UncheckedBoxIcon({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="17.5000000pt"
        height="17.5000000pt"
        viewBox="0 0 176.000000 176.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(-27.50000,205.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M681 1784 c-67 -34 -111 -78 -145 -145 l-26 -53 0 -426 0 -426 26
-53 c34 -67 78 -111 145 -145 l53 -26 426 0 426 0 53 26 c67 34 111 78 145
145 l26 53 0 426 0 426 -26 53 c-34 67 -78 111 -145 145 l-53 26 -426 0 -426
0 -53 -26z m929 -100 c35 -19 55 -39 74 -74 l26 -48 0 -401 c0 -350 -2 -406
-16 -434 -23 -45 -53 -76 -96 -98 -35 -18 -64 -19 -439 -19 l-401 0 -48 26
c-35 19 -55 39 -74 74 l-26 48 0 402 0 402 26 48 c18 34 40 55 72 74 l47 26
404 0 403 0 48 -26z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
