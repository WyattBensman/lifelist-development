import { View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import InboxTabs from "../Components/InboxTabs";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { useNavigationContext } from "../../../utils/NavigationContext";
import CreateConversationIcon from "../Icons/CreateConversationIcon";
import { layoutStyles } from "../../../styles";

export default function Inbox({ navigation }) {
  const [activeTab, setActiveTab] = useState("Messages");
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Inbox"}
        button1={<FriendsIcon />}
        button2={<CreateConversationIcon />}
      />
      <View style={layoutStyles.marginContainer}>
        <SearchBar />
      </View>
      <InboxTabs onTabChange={setActiveTab} />
    </View>
  );
}
