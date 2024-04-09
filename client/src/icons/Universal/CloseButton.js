import Svg, { Path, G } from "react-native-svg";

export default function CloseButton() {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="10.00000pt"
      height="10.00000pt"
      viewBox="0 0 32.000000 32.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G
        transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
        fill="#D4D4D4"
        stroke="none"
      >
        <Path
          d="M12 308 c-19 -19 -15 -26 45 -89 l56 -59 -56 -59 c-60 -63 -64 -70
-45 -89 19 -19 26 -15 89 45 l59 56 59 -56 c63 -60 70 -64 89 -45 19 19 15 26
-45 89 l-56 59 56 59 c60 63 64 70 45 89 -19 19 -26 15 -89 -45 l-59 -56 -59
56 c-63 60 -70 64 -89 45z"
        />
      </G>
    </Svg>
  );
}
