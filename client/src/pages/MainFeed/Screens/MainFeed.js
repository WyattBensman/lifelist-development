import { View } from "react-native";
import Header from "../../../components/Header";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import LogbookIcon from "../Icons/LogbookIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";

export default function MainFeed() {
  return (
    <View style={layoutStyles.container}>
      <Header
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon2={<LogbookIcon />}
        icon3={<InboxIcon />}
      />
    </View>
  );
}
