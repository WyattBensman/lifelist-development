import { StyleSheet, Text } from "react-native";
import Header from "../../../components/Header";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { headerStyles } from "../../../styles";

export default function AdminHeader({ navigation, setModalVisible }) {
  return (
    <Header
      titleComponent={<Text style={headerStyles.headerHeavy}>My LifeList</Text>}
      icon1={<SearchIcon />}
      icon2=<EditLifeListIcon onPress={() => setModalVisible(true)} />
      icon3={<ListViewIcon onPress={() => navigation.navigate("Listview")} />}
    />
  );
}
