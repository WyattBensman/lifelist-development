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

{
  /* <Svg
version="1.0"
xmlns="http://www.w3.org/2000/svg"
width="26.000000pt"
height="26.000000pt"
viewBox="0 0 126.000000 126.000000"
preserveAspectRatio="xMidYMid meet"
style={style}
>
<G
  transform="translate(0.000000,127.500000) scale(0.100000,-0.100000)"
  fill="#000000"
  stroke="none"
>
  <Path
    d="M392 1158 c-7 -7 -12 -24 -12 -38 0 -24 -6 -28 -58 -43 -76 -21 -120
-52 -157 -111 l-30 -49 -3 -315 c-3 -354 0 -381 65 -447 68 -70 100 -78 348
-86 193 -5 227 -9 280 -29 45 -16 73 -21 111 -17 250 25 368 314 205 499 l-31
36 0 160 c0 117 -4 171 -15 203 -31 87 -86 134 -189 160 -41 10 -46 14 -46 39
0 32 -21 53 -44 44 -10 -4 -16 -18 -16 -40 l0 -34 -180 0 -180 0 0 34 c0 22
-6 36 -16 40 -20 8 -18 8 -32 -6z m-12 -157 c0 -32 22 -56 45 -47 9 3 15 18
15 41 l0 35 180 0 180 0 0 -35 c0 -23 6 -38 15 -41 23 -9 45 15 45 48 0 28 2
29 33 23 126 -27 167 -108 167 -329 l0 -98 -27 7 c-16 4 -63 9 -105 12 -67 4
-84 2 -131 -20 -157 -72 -222 -248 -147 -404 l29 -63 -144 0 c-172 0 -235 11
-280 51 -65 57 -70 89 -70 409 0 278 1 286 23 332 29 59 87 96 165 107 4 1 7
-12 7 -28z m648 -467 c62 -31 106 -87 122 -156 53 -218 -196 -381 -378 -247
-83 61 -117 198 -73 294 20 44 78 100 125 121 53 23 145 18 204 -12z"
  />
  <Path
    d="M336 684 c-15 -38 9 -44 178 -44 88 0 167 4 174 9 8 5 12 17 10 27
-3 18 -16 19 -179 22 -157 2 -177 1 -183 -14z"
  />
  <Path
    d="M334 425 c-13 -32 15 -45 96 -45 81 0 106 12 94 44 -9 23 -182 24
-190 1z"
  />
  <Path
    d="M903 463 c-8 -3 -13 -25 -13 -59 l0 -54 -47 0 c-59 0 -77 -11 -68
-39 5 -18 14 -21 61 -21 l54 0 0 -47 c0 -59 11 -77 39 -68 18 5 21 14 21 61
l0 54 48 0 c58 0 76 11 67 39 -5 18 -14 21 -61 21 l-54 0 0 44 c0 70 -10 84
-47 69z"
  />
</G>
</Svg> */
}
