import { Text, View } from "react-native";
import { useTheme } from "../../../utils/ThemeContext";
import { globalStyling } from "../../../styles/GlobalStyling";
import UserCard from "../Cards/UserCard";

export default function Followers() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <UserCard />
    </View>
  );
}
