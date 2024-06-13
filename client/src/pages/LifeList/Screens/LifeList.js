import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { layoutStyles } from "../../../styles";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import SearchBar from "../../../components/SearchBar";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles/iconStyles";
import NavigatorContainer from "../Navigation/NavigatorContainer";

export default function LifeList({ route }) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { userId } = route.params || currentUser._id; // Extract userId from route params

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId },
  });

  useEffect(() => {
    if (data) {
      setIsAdmin(userId === currentUser._id);
    }
  }, [data, userId, currentUser._id]);

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
        arrow={<BackArrowIcon navigation={navigation} />}
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
