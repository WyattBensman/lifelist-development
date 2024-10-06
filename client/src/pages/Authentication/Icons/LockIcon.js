import { Pressable, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function LockIcon({
  color,
  backgroundColor,
  borderColor,
  onPress,
}) {
  return (
    <Pressable
      style={[styles.lockContainer, { backgroundColor, borderColor }]}
      onPress={onPress} // Trigger animation and navigation when pressed
      disabled={color !== "#6AB952"} // Disable press if the lock is not green
    >
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="44.000000pt"
        height="44.000000pt"
        viewBox="0 0 176.000000 176.000000"
        preserveAspectRatio="xMidYMid meet"
        style={{ marginBottom: 3 }}
      >
        <G
          transform="translate(0.000000,176.000000) scale(0.100000,-0.100000)"
          fill={color} // Use dynamic color passed from props
          stroke="none"
        >
          <Path d="M792 1526 c-86 -28 -149 -89 -187 -178 -10 -26 -15 -70 -15 -143 l0 -105 -65 0 c-73 0 -113 -16 -139 -54 -14 -22 -16 -67 -16 -381 0 -391 1 -400 60 -430 42 -22 856 -23 899 -1 61 32 61 31 61 421 0 391 -1 400 -60 430 -17 9 -56 15 -95 15 l-65 0 0 108 c0 124 -20 181 -85 247 -72 71 -198 102 -293 71z m159 -71 c54 -19 105 -67 130 -120 14 -30 19 -64 19 -137 l0 -98 -220 0 -220 0 0 98 c0 111 16 156 73 210 61 59 138 75 218 47z m350 -435 c18 -10 19 -25 19 -355 0 -299 -2 -346 -16 -359 -13 -14 -66 -16 -420 -16 -260 0 -412 4 -425 10 -18 10 -19 25 -19 355 0 299 2 346 16 359 13 14 66 16 420 16 260 0 412 -4 425 -10z" />
          <Path d="M820 748 c-82 -56 -53 -182 45 -194 74 -10 139 60 121 130 -19 75 -102 107 -166 64z" />
        </G>
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // To make it a circle
    borderWidth: 1, // Border width for the circle
    justifyContent: "center", // Center the LockIcon inside
    alignItems: "center",
    marginTop: 16,
  },
});
