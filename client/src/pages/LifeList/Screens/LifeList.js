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
import ActionModal from "../Popups/ActionsModal";

export default function LifeList() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {isAdmin ? (
        <AdminHeader
          navigation={navigation}
          setModalVisible={setModalVisible}
        />
      ) : (
        <StackHeader
          arrow={<BackArrowIcon />}
          title={"Seth's LifeList"}
          button1={<ListViewIcon />}
          button2={<SearchIcon />}
        />
      )}

      {/* NEED THE TAB NAVIGATOR TO GO HERE */}
      <View style={styles.container}>
        <ExpereincedList />
        <WishListedList />
      </View>

      <ActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onEditExperiences={() => {
          setModalVisible(false); // Close the modal
          navigation.navigate("Listview", { editMode: true }); // Navigate with editMode = true
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
