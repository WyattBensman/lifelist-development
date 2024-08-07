import Svg, { Path, G } from "react-native-svg";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogbookIcon() {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate("Logbook")}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="27.500000pt"
        height="27.500000pt"
        viewBox="0 -6 108.000000 108.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,108.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M192 948 c-19 -19 -17 -777 2 -804 13 -17 29 -19 155 -22 l141 -4 0
31 0 31 -125 0 -125 0 0 360 0 360 75 0 75 0 0 -177 0 -178 41 48 42 49 31
-48 31 -48 3 177 2 177 135 0 135 0 0 -182 1 -183 29 35 30 34 0 166 c0 116
-4 170 -12 178 -17 17 -649 17 -666 0z"
          />
          <Path
            d="M920 515 l-24 -25 44 -45 44 -45 23 22 c13 12 23 29 23 39 0 16 -62
79 -79 79 -4 0 -18 -11 -31 -25z"
          />
          <Path
            d="M722 317 l-132 -132 0 -48 0 -47 42 0 c41 0 47 4 180 137 l138 137
-42 43 c-23 24 -45 43 -48 43 -3 0 -65 -60 -138 -133z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
