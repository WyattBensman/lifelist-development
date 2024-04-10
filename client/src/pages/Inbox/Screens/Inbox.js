import { StyleSheet, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import InboxTabs from "../Components/InboxTabs";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { useNavigationContext } from "../../../utils/NavigationContext";
import { useTheme } from "../../../utils/ThemeContext";
import CreateConversationIcon from "../Icons/CreateConversationIcon";

export default function Inbox({ navigation }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Messages");
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Inbox"}
        button1={<CreateConversationIcon />}
        button2={<FriendsIcon />}
      />
      <View style={styles.searchBar}>
        <SearchBar />
      </View>
      <InboxTabs onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 10,
  },
});
