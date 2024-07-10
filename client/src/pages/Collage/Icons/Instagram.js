import { Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Instagram({ onPress }) {
  return (
    <Pressable style={styles.iconContainer} onPress={onPress}>
      <Svg
        width="21"
        height="21"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M6.38 0.125H15.62C19.071 0.125 21.875 2.92904 21.875 6.38V15.62C21.875 17.2789 21.216 18.8699 20.043 20.043C18.8699 21.216 17.2789 21.875 15.62 21.875H6.38C2.92904 21.875 0.125 19.071 0.125 15.62V6.38C0.125 4.72107 0.784007 3.13009 1.95705 1.95705C3.13009 0.784007 4.72107 0.125 6.38 0.125ZM6.16 2.075C5.07659 2.075 4.03756 2.50538 3.27147 3.27147C2.50538 4.03756 2.075 5.07659 2.075 6.16V15.84C2.075 18.098 3.90196 19.925 6.16 19.925H15.84C16.9234 19.925 17.9624 19.4946 18.7285 18.7285C19.4946 17.9624 19.925 16.9234 19.925 15.84V6.16C19.925 3.90196 18.098 2.075 15.84 2.075H6.16ZM16.775 3.975C17.1065 3.975 17.4245 4.1067 17.6589 4.34112C17.8933 4.57554 18.025 4.89348 18.025 5.225C18.025 5.55652 17.8933 5.87446 17.6589 6.10888C17.4245 6.3433 17.1065 6.475 16.775 6.475C16.4435 6.475 16.1255 6.3433 15.8911 6.10888C15.6567 5.87446 15.525 5.55652 15.525 5.225C15.525 4.89348 15.6567 4.57554 15.8911 4.34112C16.1255 4.1067 16.4435 3.975 16.775 3.975ZM11 5.625C12.4255 5.625 13.7927 6.19129 14.8007 7.1993C15.8087 8.20731 16.375 9.57446 16.375 11C16.375 12.4255 15.8087 13.7927 14.8007 14.8007C13.7927 15.8087 12.4255 16.375 11 16.375C9.57446 16.375 8.20731 15.8087 7.1993 14.8007C6.19129 13.7927 5.625 12.4255 5.625 11C5.625 9.57446 6.19129 8.20731 7.1993 7.1993C8.20731 6.19129 9.57446 5.625 11 5.625ZM11 7.575C10.0916 7.575 9.22047 7.93585 8.57816 8.57816C7.93585 9.22047 7.575 10.0916 7.575 11C7.575 11.9084 7.93585 12.7795 8.57816 13.4218C9.22047 14.0642 10.0916 14.425 11 14.425C11.9084 14.425 12.7795 14.0642 13.4218 13.4218C14.0642 12.7795 14.425 11.9084 14.425 11C14.425 10.0916 14.0642 9.22047 13.4218 8.57816C12.7795 7.93585 11.9084 7.575 11 7.575Z"
          fill="#fff"
          stroke="transparent"
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