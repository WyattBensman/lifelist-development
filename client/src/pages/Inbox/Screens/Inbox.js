import { View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import InboxTabs from "../Components/InboxTabs";
import CreateMessageIcon from "../Icons/CreateMessageIcon";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { useNavigationContext } from "../../../utils/NavigationContext";

export default function Inbox({ navigation }) {
  const [activeTab, setActiveTab] = useState("Messages");
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  const getRightIcon = () =>
    activeTab === "Messages" ? <CreateMessageIcon /> : <FriendsIcon />;

  return (
    <View style={globalStyling.container}>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Inbox"}
        button1={<CreateMessageIcon />}
        button2={<FriendsIcon />}
      />
      <SearchBar />
      <InboxTabs onTabChange={setActiveTab} />
    </View>
  );
}
