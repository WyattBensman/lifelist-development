import { Pressable } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function FujiCameraIcon({ onPress, color = "#ffffff" }) {
  return (
    <Pressable onPress={onPress}>
      <Svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="38.698000000pt"
        height="25.000000pt"
        viewBox="0 0 452.000000 292.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,292.000000) scale(0.100000,-0.100000)"
          fill={color}
          stroke="none"
        >
          <Path
            d="M2050 2580 c0 -5 -6 -10 -14 -10 -8 0 -83 -76 -166 -170 l-152 -170
-174 0 -174 0 0 93 c0 59 -4 97 -12 105 -17 17 -549 17 -566 0 -8 -8 -12 -46
-12 -105 l0 -93 -70 0 c-81 0 -128 -16 -158 -55 -20 -25 -22 -40 -22 -156 0
-97 -3 -129 -12 -129 -62 0 -153 -61 -185 -124 -9 -17 -16 -56 -17 -86 0 -106
71 -192 174 -209 l35 -6 5 -517 5 -516 24 -26 c14 -14 41 -30 60 -36 23 -6
635 -10 1716 -10 1580 0 1682 1 1714 18 19 9 44 30 55 45 21 28 21 41 24 538
l3 509 25 0 c36 0 96 34 132 74 103 118 33 308 -124 341 l-32 6 -3 124 c-3
106 -7 128 -25 152 -29 40 -80 63 -141 63 l-53 0 0 93 c0 59 -4 97 -12 105 -7
7 -34 12 -60 12 l-48 0 0 48 c0 82 1 82 -274 82 -144 0 -245 -4 -257 -10 -15
-9 -19 -22 -19 -65 l0 -55 -53 0 c-29 0 -58 -5 -65 -12 -8 -8 -12 -46 -12
-105 l0 -93 -47 0 -48 1 -154 174 c-84 96 -157 172 -162 170 -4 -3 -10 -1 -14
5 -8 14 -635 14 -635 0z m733 -212 l117 -133 -526 -3 c-290 -1 -529 0 -532 3
-2 2 48 63 112 135 l117 130 298 0 297 0 117 -132z m917 92 c0 -19 -7 -20
-190 -20 -183 0 -190 1 -190 20 0 19 7 20 190 20 183 0 190 -1 190 -20z
m-2412 -167 l3 -63 -216 0 -215 0 0 58 c0 32 3 62 7 66 4 3 99 5 212 4 l206
-3 3 -62z m2542 2 l0 -65 -320 0 -320 0 0 58 c0 32 3 62 7 65 3 4 147 7 320 7
l313 0 0 -65z m-2094 -172 c-16 -55 -96 -354 -96 -358 0 -3 -207 -5 -459 -5
l-460 0 -18 30 c-10 17 -35 42 -55 57 l-38 26 0 121 c0 82 4 126 12 134 9 9
148 12 566 12 522 0 553 -1 548 -17z m1214 -140 c24 -87 45 -167 48 -178 3
-11 -24 11 -64 51 -81 82 -138 123 -237 169 -119 57 -184 70 -337 69 -125 0
-142 -3 -230 -33 -132 -45 -221 -100 -317 -196 -45 -46 -80 -77 -78 -71 2 6
20 72 40 146 20 74 41 150 46 168 l11 32 537 0 538 0 43 -157z m1078 145 c8
-8 12 -51 12 -129 l0 -117 -61 -61 -61 -61 -411 2 -410 3 -49 175 c-26 96 -48
181 -48 188 0 17 1010 18 1028 0z m-1572 -119 c219 -30 403 -152 514 -339 177
-299 102 -693 -174 -905 -356 -274 -873 -147 -1061 260 -91 195 -87 406 11
605 100 204 303 349 529 379 87 12 96 12 181 0z m-1866 -224 c37 -19 60 -63
60 -115 0 -32 -7 -48 -34 -78 -32 -34 -38 -37 -91 -37 -53 0 -59 3 -91 37 -27
30 -34 46 -34 78 0 79 47 129 123 130 21 0 51 -7 67 -15z m3600 0 c37 -19 60
-63 60 -115 0 -32 -7 -48 -33 -76 -79 -86 -217 -32 -217 86 0 40 28 88 62 106
31 18 93 17 128 -1z m-2520 -110 c0 -4 -6 -18 -14 -33 -80 -155 -90 -403 -24
-581 29 -78 32 -98 35 -223 l4 -138 -530 0 -531 0 0 394 c0 384 1 395 20 401
34 11 88 84 100 136 l12 49 464 0 c255 0 464 -2 464 -5z m2251 -35 c3 -19 13
-49 22 -66 17 -32 71 -84 88 -84 5 0 9 -160 9 -395 l0 -395 -485 0 -485 0 0
132 c0 118 3 138 26 196 65 164 71 367 15 527 -17 50 -34 98 -37 108 -6 16 17
17 417 15 l424 -3 6 -35z m-2137 -845 c29 -44 168 -147 251 -186 116 -53 200
-72 330 -72 218 0 390 69 548 221 l67 65 0 -186 0 -187 -615 0 -615 0 0 185
c0 102 4 185 9 185 5 0 16 -11 25 -25z m-114 -260 l0 -85 -518 0 c-390 0 -521
3 -530 12 -7 7 -12 42 -12 85 l0 73 530 0 530 0 0 -85z m2370 12 c0 -43 -5
-78 -12 -85 -9 -9 -130 -12 -485 -12 l-473 0 0 85 0 85 485 0 485 0 0 -73z"
          />
          <Path
            d="M2225 1914 c-213 -52 -396 -232 -451 -445 -20 -76 -22 -213 -5 -289
39 -170 167 -332 323 -410 248 -123 531 -72 720 129 110 116 168 261 168 416
-1 395 -373 691 -755 599z m316 -98 c238 -82 386 -324 351 -570 -28 -192 -160
-358 -341 -427 -77 -30 -224 -37 -308 -15 -238 61 -403 269 -403 511 0 364
358 619 701 501z"
          />
          <Path
            d="M2280 1665 c-106 -30 -186 -96 -237 -195 -25 -49 -28 -65 -28 -150 0
-82 4 -103 26 -151 36 -76 86 -129 161 -170 60 -32 68 -34 163 -34 121 0 167
18 249 95 128 121 149 309 51 457 -82 124 -245 186 -385 148z m181 -90 c59
-20 112 -65 147 -123 24 -41 27 -57 27 -132 0 -97 -16 -141 -73 -198 -81 -81
-218 -102 -318 -50 -160 84 -201 288 -83 422 78 89 189 119 300 81z"
          />
        </G>
      </Svg>
    </Pressable>
  );
}