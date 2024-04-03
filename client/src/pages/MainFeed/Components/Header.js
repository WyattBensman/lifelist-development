import { Image, StyleSheet, Text, View } from "react-native";
import CreateCollageIcon from "../../../../public/svgs/MainFeed/CreateCollageIcon";
import LogbookIcon from "../../../../public/svgs/MainFeed/LogbookIcon";
import InboxIcon from "../../../../public/svgs/MainFeed/InboxIcon";
import LifeListLogo from "../../../../public/svgs/MainFeed/LifeListLogo";

export default function Header() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <LifeListLogo />
        <View style={styles.btnContainer}>
          <CreateCollageIcon style={styles.icon} />
          <LogbookIcon style={styles.icon} />
          <InboxIcon style={styles.icon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 40,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
  },
  icon: {
    marginLeft: 10,
  },
});
