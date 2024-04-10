import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function BackArrowIcon({ navigation }) {
  return (
    <Pressable onPress={() => navigation.goBack()} style={{ width: 15 }}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="35.000000pt"
        height="35.000000pt"
        viewBox="60 0 176.000000 176.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,176.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M951 1193 c-16 -16 -93 -97 -171 -180 l-142 -153 157 -167 c86 -93
165 -174 175 -182 43 -30 106 21 84 68 -5 11 -62 76 -126 145 -65 68 -118 131
-118 139 0 8 7 21 17 28 54 45 233 251 233 269 0 26 -34 60 -60 60 -11 0 -33
-12 -49 -27z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
