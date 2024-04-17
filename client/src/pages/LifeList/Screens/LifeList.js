import { View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ActionModal from "../Popups/ActionsModal";
import AdminHeader from "../Components/AdminHeader";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { layoutStyles } from "../../../styles";
import CategoryNavigator from "../Navigation/LifeListNavigator";

export default function LifeList() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={layoutStyles.wrapper}>
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

        <CategoryNavigator />

        {/* NEED THE TAB NAVIGATOR TO GO HERE */}
        {/* <View style={layoutStyles.wrapper}>
        <ExpereincedList />
        <WishListedList />
      </View> */}

        {/* <ActionModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onEditExperiences={() => {
            setModalVisible(false);
            navigation.navigate("Listview", { editMode: true });
          }}
        /> */}
      </View>
    </>
  );
}
