import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserRelationsNavigator from "../Navigators/UserRelationsNavigator";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchBar from "../../../components/SearchBar";
import { layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../utils/NavigationContext";
import { useEffect } from "react";

export default function UserRelations() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.container}>
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
