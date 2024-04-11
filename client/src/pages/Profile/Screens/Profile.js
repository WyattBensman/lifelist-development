import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import Header from "../../../components/Header";
import FlowPageIcon from "../Icons/FlowPageIcon";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import { useTheme } from "../../../utils/ThemeContext";
import ProfileNavigator from "../Components/ProfileNavigator";

export default function Profile() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Header
        titleComponent={<Text style={styles.header}>Wyatt Bensman</Text>}
        icon1={<FlowPageIcon />}
        icon2={<OptionsIcon />}
      />
      <ProfileOverview />
      <ProfileNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
});
