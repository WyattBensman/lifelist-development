import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useQuery, gql } from "@apollo/client";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { BASE_URL } from "../../../utils/config";
import { GET_LIFELIST_EXPERIENCE } from "../../../utils/queries/lifeListQueries";

export default function ViewExperience({ route, navigation }) {
  const { experienceId } = route.params;
  console.log(experienceId);
  const { data, loading, error } = useQuery(GET_LIFELIST_EXPERIENCE, {
    variables: { experienceId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { experience, associatedShots } = data.getLifeListExperience;

  return (
    <View style={styles.container}>
      <HeaderStack
        title={experience.title}
        arrow={<BackArrowIcon navigation={navigation} />}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>{experience.title}</Text>
      <Text style={styles.category}>{experience.category}</Text>
      <FlatList
        data={associatedShots}
        keyExtractor={(item) => item.shot._id}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${BASE_URL}${item.shot.image}` }}
            style={styles.shotImage}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  category: {
    fontSize: 18,
    color: "#888",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  shotImage: {
    width: 100,
    height: 100,
    margin: 8,
  },
});
