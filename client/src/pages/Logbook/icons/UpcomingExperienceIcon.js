import { StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function UpcomingExperienceIcon() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="20.000000pt"
      height="20.000000pt"
      viewBox="0 0 81.000000 80.000000"
      preserveAspectRatio="xMidYMid meet"
      style={styles.spacing}
    >
      <G
        transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <Path
          d="M292 691 c-23 -14 -10 -46 18 -46 20 0 25 5 25 25 0 26 -20 36 -43
21z"
        />
        <Path
          d="M425 690 c-11 -18 3 -27 50 -33 57 -8 111 -36 151 -79 54 -57 69 -95
69 -178 0 -83 -15 -121 -69 -178 -53 -57 -101 -77 -186 -77 -83 0 -121 15
-178 69 -36 33 -59 72 -73 119 -7 25 -6 28 9 22 68 -29 78 7 11 40 l-52 27
-41 -41 c-31 -31 -38 -43 -28 -53 9 -9 16 -8 30 5 26 23 29 22 36 -16 9 -49
59 -122 106 -156 94 -68 210 -78 315 -26 231 113 211 454 -32 545 -58 22 -108
26 -118 10z"
        />
        <Path
          d="M192 631 c-23 -14 -10 -46 18 -46 20 0 25 5 25 25 0 26 -20 36 -43
21z"
        />
        <Path
          d="M132 531 c-23 -14 -10 -46 18 -46 20 0 25 5 25 25 0 26 -20 36 -43
21z"
        />
        <Path
          d="M424 527 c-3 -8 -4 -43 -2 -78 l3 -64 75 0 c60 0 75 3 75 15 0 11
-14 16 -57 18 l-57 3 -3 56 c-3 55 -21 82 -34 50z"
        />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginRight: 5,
  },
});