import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserRelationsNavigator from "../Components/UserRelationsNavigator";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "../../../utils/ThemeContext";
import SearchBar from "../../../components/SearchBar";

export default function UserRelations() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StackHeader
        title="User Relations"
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View style={styles.searchBar}>
        <SearchBar />
      </View>
      <UserRelationsNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});
