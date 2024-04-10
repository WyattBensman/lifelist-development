import { StyleSheet, View } from "react-native";
import Header from "../Components/Header";
import { useTheme } from "../../../utils/ThemeContext";

export default function MainFeed() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
