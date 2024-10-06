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

export default function LifeList({ route }) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { userId } = route.params || currentUser; // Extract userId from route params

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId },
  });

  useEffect(() => {
    if (data) {
      setIsAdmin(userId === currentUser);
    }
  }, [data, userId, currentUser]);

  const lifeList = data?.getUserLifeList || { experiences: [] };

  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return lifeList.experiences;
    return lifeList.experiences.filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, lifeList.experiences]);

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
