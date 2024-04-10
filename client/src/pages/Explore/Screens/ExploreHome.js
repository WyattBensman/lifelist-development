import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import SearchBar from "../../../components/SearchBar";
import FromYourListList from "../Components/FromYourLifeList";
import TrendingCollages from "../Components/TrendingCollages";
import TrendingDestinations from "../Components/TrendingDestinations";
import TrendingActivities from "../Components/TrendingActivites";
import TrendingAttractions from "../Components/TrendingAttractions";
import TrendingConcertsFestivals from "../Components/TrendingConcertsFestivals";
import { useTheme } from "../../../utils/ThemeContext";

export default function ExploreHome({ navigation }) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SearchBar style={{ marginRight: 20 }} />
      <Pressable onPress={() => navigation.navigate("ExplorePage")}>
        <Text>Go to Explore Page</Text>
      </Pressable>
      <ScrollView style={styles.content}>
        <FromYourListList />
        <TrendingCollages />
        <TrendingDestinations />
        <TrendingConcertsFestivals />
        <TrendingActivities />
        <TrendingAttractions />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 20,
  },
  content: {
    marginTop: 10,
    paddingTop: 10,
  },
});
