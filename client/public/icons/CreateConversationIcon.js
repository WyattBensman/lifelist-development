import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function CreateConversationIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="25.000000pt"
      height="25.000000pt"
      viewBox="0 0 112.000000 112.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G
        transform="translate(0.000000,112.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M105 1048 c-44 -25 -44 -29 -45 -365 0 -215 4 -330 11 -346 17 -37
50 -47 149 -47 l89 0 3 -72 c2 -58 6 -73 19 -76 9 -2 72 31 140 72 l123 76
179 0 c180 0 208 5 234 39 9 12 12 101 13 339 0 330 -2 351 -39 379 -22 17
-847 18 -876 1z m855 -373 l0 -325 -190 0 -189 0 -99 -60 c-55 -33 -102 -60
-106 -60 -3 0 -6 27 -6 60 l0 60 -125 0 -125 0 0 325 0 325 420 0 420 0 0
-325z"
        />
        <Path
          d="M622 857 c-28 -30 -28 -35 5 -69 32 -34 43 -35 71 -5 l22 23 -38 37
-38 37 -22 -23z"
        />
        <Path
          d="M457 692 c-88 -88 -97 -101 -97 -135 0 -36 1 -37 38 -37 34 0 46 9
135 98 l97 98 -38 37 -38 37 -97 -98z"
        />
      </G>
    </Svg>
  );
}
