import { Text } from "react-native";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { headerStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";

export default function AdminHeader({ navigation, setModalVisible }) {
  return (
    <HeaderMain
      titleComponent={<Text style={headerStyles.headerHeavy}>My LifeList</Text>}
      icon1={<SearchIcon />}
      icon2=<EditLifeListIcon onPress={() => setModalVisible(true)} />
      icon3={<ListViewIcon onPress={() => navigation.navigate("Listview")} />}
    />
  );
}
