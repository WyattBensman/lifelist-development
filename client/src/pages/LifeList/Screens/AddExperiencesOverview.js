import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AddExperienceCard from "../Cards/AddExperienceCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeListExperienceContext } from "../../../contexts/LifeListExperienceContext";
import { useLifeList } from "../../../contexts/LifeListContext";

export default function AddExperiencesOverview() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { addLifeListExperienceToCache } = useLifeList(); // Use LifeListContext for adding and caching experiences

  // Retrieve lifeListId from route params
  const route = useRoute();
  const { lifeListId } = route.params;

  // Access LifeListExperience context
  const {
    lifeListExperiences,
    updateLifeListExperience,
    removeLifeListExperience,
  } = useLifeListExperienceContext();

  console.log(lifeListExperiences);

  // Focus effect for hiding the tab bar
  useFocusEffect(
    React.useCallback(() => {
      setIsTabBarVisible(false);
    }, [setIsTabBarVisible])
  );

  // Effect for navigating back if there are no experiences
  useEffect(() => {
    if (lifeListExperiences.length === 0) {
      navigation.goBack();
    }
  }, [lifeListExperiences.length, navigation]);

  // Check if all experiences have a selected list
  const allExperiencesHaveList = lifeListExperiences.every(
    (exp) => exp.list !== null
  );

  // Check if there are experiences in the list
  const hasExperiences = lifeListExperiences.length > 0;

  // Handle deleting an experience by removing it from the context
  const handleDeleteExperience = (experienceId) => {
    removeLifeListExperience(experienceId);
  };

  // Handle adding multiple experiences to the LifeList
  const handleAddExperiences = async () => {
    if (!allExperiencesHaveList || !hasExperiences) return;

    try {
      console.log("Adding multiple experiences:", lifeListExperiences);

      await addLifeListExperienceToCache(
        lifeListExperiences.map((exp) => ({
          lifeListId,
          experience: exp.experience,
          list: exp.list,
          associatedShots: exp.associatedShots,
        })),
        true
      );

      // Navigate to another screen upon success
      navigation.navigate("AdminLifeList");
    } catch (error) {
      console.error("Error adding experiences:", error);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={"New Experiences"}
        button1={
          <Pressable
            onPress={handleAddExperiences}
            disabled={!allExperiencesHaveList || !hasExperiences} // Disable if no experiences or not all have a list
          >
            <Text
              style={[
                styles.createButtonText,
                allExperiencesHaveList &&
                  hasExperiences &&
                  styles.createButtonTextActive,
              ]}
            >
              Add
            </Text>
          </Pressable>
        }
      />
      <ScrollView style={{ marginTop: 8, flex: 1 }}>
        <FlatList
          data={lifeListExperiences}
          renderItem={({ item }) => (
            <AddExperienceCard
              lifeListExperience={item} // Pass full lifeListExperience object
              onListSelect={(newListStatus) =>
                updateLifeListExperience(item.experience._id, {
                  list: newListStatus,
                })
              }
              onUpdateShots={(newShots) =>
                updateLifeListExperience(item.experience._id, {
                  associatedShots: newShots,
                })
              }
              onDelete={handleDeleteExperience} // Pass down the delete handler
            />
          )}
          keyExtractor={(item) => item.experience._id} // Correctly reference experience._id
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  createButtonText: {
    fontSize: 12,
    color: "#696969", // Inactive color
    fontWeight: "600",
  },
  createButtonTextActive: {
    color: "#6AB952", // Active color when all experiences have a list and there's at least one experience
    fontWeight: "600",
  },
});
