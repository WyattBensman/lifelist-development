import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function ListViewIcon({ style, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24.0000pt"
        height="18.0000pt"
        viewBox="0 0 80.000000 60.000000"
        preserveAspectRatio="xMidYMid meet"
        style={{ marginTop: 1.5 }}
      >
        <G
          transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M34 555 c-4 -8 -4 -22 0 -30 5 -13 52 -15 368 -13 l363 3 0 25 0 25
-363 3 c-316 2 -363 0 -368 -13z"
          />
          <Path
            d="M34 315 c-4 -8 -4 -22 0 -30 5 -13 52 -15 368 -13 l363 3 0 25 0 25
-363 3 c-316 2 -363 0 -368 -13z"
          />
          <Path
            d="M34 75 c-4 -8 -4 -22 0 -30 5 -13 52 -15 368 -13 l363 3 0 25 0 25
-363 3 c-316 2 -363 0 -368 -13z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
