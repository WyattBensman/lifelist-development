import { Text, View } from "react-native";
import { useTheme } from "../../../utils/ThemeContext";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function Recent() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text>Hey</Text>
    </View>
  );
}
