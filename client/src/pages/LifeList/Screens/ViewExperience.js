import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_LIFELIST_EXPERIENCE } from "../../../utils/queries/lifeListQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ExperienceNavigator from "../Navigation/ExperienceNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useFocusEffect } from "@react-navigation/native";

export default function ViewExperience({ route, navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { experienceId } = route.params;
  const { data, loading, error } = useQuery(GET_LIFELIST_EXPERIENCE, {
    variables: { experienceId },
  });

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { experience, associatedShots } = data.getLifeListExperience;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={experience.title}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        onPress={() => navigation.goBack()}
        hasBorder={false}
      />
      <ExperienceNavigator
        experienceId={experienceId}
        associatedShots={associatedShots}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
