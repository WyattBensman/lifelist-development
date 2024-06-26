import { Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Facebook({ onPress }) {
  return (
    <Pressable style={styles.iconContainer} onPress={onPress}>
      <Svg
        width="11.4545"
        height="21"
        viewBox="0 0 12 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M7.65217 12.4H7.40217V12.65V21.75H3.5295V12.65V12.4H3.2795H0.25V8.5H3.2795H3.5295V8.25V5.17C3.5295 3.55022 4.03809 2.32721 4.8787 1.5089C5.72062 0.689303 6.922 0.25 8.35508 0.25C9.55684 0.25 10.7018 0.326904 11.2283 0.377906V3.6H9.83851C8.71445 3.6 8.06049 3.87385 7.7177 4.38608C7.55194 4.63378 7.47544 4.91497 7.43848 5.19562C7.40216 5.4713 7.40217 5.76416 7.40217 6.04121V6.05V8.25V8.5H7.65217H11.1585L10.1896 12.4H7.65217Z"
          fill="#fff"
          stroke="transparent"
          stroke-width="0.5"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 50,
    padding: 10,
    height: 37.5,
    width: 37.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
  },
});
