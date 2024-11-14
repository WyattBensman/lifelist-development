import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import SearchBar from "../../../components/SearchBar";
import { iconStyles } from "../../../styles/iconStyles";
import NavigatorContainer from "../Navigation/NavigatorContainer";
import Icon from "../../../components/Icons/Icon";
import {
  saveMetaDataToCache,
  getMetaDataFromCache,
  saveImageToCache,
  getImageFromCache,
} from "../../../utils/cacheHelper";

export default function LifeList({ route }) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { userId } = route.params || currentUser;

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cachedLifeList, setCachedLifeList] = useState(null);

  const cacheKey = `user_lifeList_${userId}`;

  const { data, loading, error } = useQuery(GET_USER_LIFELIST, {
    variables: { userId },
    skip: !!cachedLifeList,
  });

  useEffect(() => {
    const loadCachedLifeList = async () => {
      const cachedData = getMetaDataFromCache(cacheKey);
      if (cachedData) {
        console.log("Using cached LifeList metadata for user:", userId);
        setCachedLifeList(cachedData);
        cacheExperienceImages(cachedData.experiences);
      }
    };
    loadCachedLifeList();
  }, [cacheKey, userId]);

  useEffect(() => {
    if (data && !cachedLifeList) {
      console.log("Fetched LifeList data from server and caching metadata");
      const lifeListData = data.getUserLifeList;
      saveMetaDataToCache(cacheKey, lifeListData); // No TTL needed
      setCachedLifeList(lifeListData);
      cacheExperienceImages(lifeListData.experiences);
    }
  }, [data, cachedLifeList, cacheKey]);

  const cacheExperienceImages = async (experiences) => {
    for (const exp of experiences) {
      const imageKey = `experience_image_${exp.experience._id}`;
      const cachedImageUri = await getImageFromCache(
        imageKey,
        exp.experience.image
      );

      if (!cachedImageUri) {
        console.log(`Caching image for experience: ${exp.experience.title}`);
        await saveImageToCache(imageKey, exp.experience.image);
      } else {
        console.log(`Image already cached: ${cachedImageUri}`);
      }
    }
  };

  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return cachedLifeList?.experiences || [];
    return (cachedLifeList?.experiences || []).filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, cachedLifeList]);

  useEffect(() => {
    if (data) {
      setIsAdmin(userId === currentUser);
    }
  }, [data, userId, currentUser]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      {searchBarVisible && (
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => setSearchBarVisible(false)}
        />
      )}
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={"LifeList"}
        button1={
          <Icon
            name="line.3.horizontal"
            style={iconStyles.list}
            onPress={() => navigation.navigate("ListView", { userId })}
          />
        }
      />
      <NavigatorContainer
        lifeList={{ experiences: filteredExperiences }}
        navigation={navigation}
      />
    </View>
  );
}
