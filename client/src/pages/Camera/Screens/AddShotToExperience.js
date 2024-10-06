import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import ListViewNavigator from "../Navigators/ListViewNavigator";
import AddShotToExperienceCard from "../Cards/AddShotToExperienceCard";

export default function AddShotToExperience({ navigation, route }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { currentUser } = useAuth();
  const userId = currentUser;
  const shotId = route.params.shotId;

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId },
  });

  const [lifeList, setLifeList] = useState({ experiences: [] });

  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (data) {
      setLifeList(data.getUserLifeList);
    }
  }, [data]);

  const experiencedExperiences = lifeList.experiences.filter(
    (exp) => exp.list === "EXPERIENCED"
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListViewNavigator
        lifeList={{ experiences: experiencedExperiences }}
        searchQuery={searchQuery}
        navigation={navigation}
        cardComponent={(props) => (
          <AddShotToExperienceCard {...props} shotId={shotId} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 2,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#252525",
  },
});
