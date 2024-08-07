import Svg, { Path, G } from "react-native-svg";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function InboxIcon({ style }) {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate("Inbox")}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="29.000000pt"
        height="29.000000pt"
        viewBox="0 0 128.000000 128.000000"
        preserveAspectRatio="xMidYMid meet"
        style={style}
      >
        <G
          transform="translate(0.000000,135.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path
            d="M530 1106 c-88 -23 -165 -89 -201 -170 -24 -56 -40 -180 -32 -259 8
-87 1 -108 -45 -136 -71 -43 -115 -144 -80 -179 9 -9 129 -12 478 -12 454 0
467 1 485 20 34 38 -9 127 -85 175 l-37 24 -5 148 c-4 103 -10 162 -22 193
-52 140 -166 211 -335 209 -42 0 -96 -6 -121 -13z m275 -83 c49 -26 76 -54
106 -113 20 -39 23 -65 28 -200 3 -85 11 -163 17 -173 6 -10 32 -35 59 -55 27
-20 50 -43 53 -49 3 -10 -85 -13 -418 -13 -419 0 -421 0 -410 20 6 11 29 31
50 45 69 43 74 60 75 220 1 140 2 144 33 208 54 108 114 138 267 134 78 -2
109 -8 140 -24z"
          />
          <Path
            d="M530 240 c0 -81 103 -136 180 -97 29 15 70 72 70 98 0 18 -10 19
-125 19 -119 0 -125 -1 -125 -20z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}
