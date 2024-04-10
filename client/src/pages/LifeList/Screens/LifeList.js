import { StyleSheet, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import AdminHeader from "../Components/AdminHeader";
import { useTheme } from "../../../utils/ThemeContext";
import ExpereincedList from "../Components/ExperiencedList";
import WishListedList from "../Components/WishListedList";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function LifeList() {
  const theme = useTheme();
  const [isAdmin, setIsAdmin] = useState(true);
  const navigation = useNavigation();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {isAdmin ? (
        <AdminHeader navigation={navigation} />
      ) : (
        <StackHeader
          arrow={<BackArrowIcon />}
          title={"Seth's LifeList"}
          button1={<ListViewIcon style={{ marginLeft: 0 }} />}
          button2={<SearchIcon />}
        />
      )}

      {/* NEED THE TAB NAVIGATOR TO GO HERE */}
      <View style={styles.container}>
        <ExpereincedList />
        <WishListedList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
