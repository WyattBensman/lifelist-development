import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { layoutStyles } from "../../../styles";
import SearchBar from "../../../components/SearchBar";
import FromYourListList from "../Containers/FromYourLifeList";
import TrendingCollages from "../Containers/TrendingCollages";
import TrendingDestinations from "../Containers/TrendingDestinations";
import TrendingActivities from "../Containers/TrendingActivites";
import TrendingAttractions from "../Containers/TrendingAttractions";
import TrendingConcertsFestivals from "../Containers/TrendingConcertsFestivals";

export default function ExploreHome({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={layoutStyles.contentContainer}>
        <SearchBar />
        <ScrollView style={[layoutStyles.marginTopLg, { marginRight: -16 }]}>
          <FromYourListList />
          <TrendingCollages />
          <TrendingDestinations />
          <TrendingConcertsFestivals />
          <TrendingActivities />
          <TrendingAttractions />
        </ScrollView>
        <Pressable onPress={() => navigation.navigate("ExplorePage")}>
          <Text>Go to Explore Page</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#ffffff",
  },
  content: {
    marginTop: 10,
    paddingTop: 10,
  },
});
