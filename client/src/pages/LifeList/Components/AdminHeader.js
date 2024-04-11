import { StyleSheet, Text } from "react-native";
import Header from "../../../components/Header";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";

export default function AdminHeader({ navigation, setModalVisible }) {
  return (
    <Header
      titleComponent={<Text style={styles.header}>My LifeList</Text>}
      icon1={<SearchIcon />}
      icon2=<EditLifeListIcon onPress={() => setModalVisible(true)} />
      icon3={
        <ListViewIcon
          style={styles.iconSpacing}
          onPress={() => navigation.navigate("Listview")}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
});
