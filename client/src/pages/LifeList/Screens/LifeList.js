import { View } from "react-native";
import AdminHeader from "../Components/AdminHeader";
import ExpereincedList from "../Components/ExperiencedList";
import WishListedList from "../Components/WishListedList";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ActionModal from "../Popups/ActionsModal";
import { layoutStyles } from "../../../styles";

export default function LifeList() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={layoutStyles.container}>
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
      <View style={layoutStyles.marginContainer}>
        <ExpereincedList />
        <WishListedList />
      </View>

      <ActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onEditExperiences={() => {
          setModalVisible(false);
          navigation.navigate("Listview", { editMode: true });
        }}
      />
    </View>
  );
}
