import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../utils/ThemeContext";
import Header from "../../../components/Header";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import LogbookIcon from "../Icons/LogbookIcon";
import InboxIcon from "../Icons/InboxIcon";

export default function MainFeed() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon2={<LogbookIcon />}
        icon3={<InboxIcon />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
