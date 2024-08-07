import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function CheckedBoxIcon({ onPress }) {
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
          transform="translate(0.000000,176.000000) scale(0.100000,-0.100000)"
          fill="#DB302D"
          stroke="none"
        >
          <Path
            d="M463 1530 c-96 -20 -184 -94 -219 -186 -18 -45 -19 -80 -19 -464 0
-385 1 -419 19 -465 25 -65 94 -137 159 -166 l52 -24 425 0 425 0 52 24 c65
29 134 101 159 166 18 46 19 80 19 465 0 385 -1 419 -19 465 -25 65 -94 137
-159 166 -52 24 -55 24 -452 26 -220 1 -419 -2 -442 -7z m771 -381 c20 -15 26
-29 26 -57 0 -34 -14 -50 -223 -259 -281 -281 -250 -273 -419 -105 -107 108
-118 122 -118 155 0 39 36 77 72 77 10 0 52 -31 93 -70 65 -62 79 -70 112 -70
36 0 47 9 203 166 195 195 205 202 254 163z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
