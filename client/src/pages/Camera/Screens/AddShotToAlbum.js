import React, { useEffect, useState, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import AddShotToAlbumCard from "../Cards/AddShotToAlbumCard";
import { GET_ALL_CAMERA_ALBUMS } from "../../../utils/queries";

export default function AddShotToAlbum({ navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { currentUser } = useAuth();
  const userId = currentUser;

  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_ALBUMS, {
    variables: { userId },
  });

  const [albums, setAlbums] = useState([]);
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (data) {
      setAlbums(data.getAllCameraAlbums);
    }
  }, [data]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCheckPress = () => {
    // Add logic to handle check press
  };

  // Filter albums based on the search query
  const filteredAlbums = useMemo(() => {
    if (!searchQuery) {
      return albums; // Return all albums if search query is empty
    }
    return albums.filter((album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, albums]);

  const renderAlbum = ({ item }) => (
    <AddShotToAlbumCard
      key={item._id}
      album={item}
      shotId={route.params.shotId}
    />
  );

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
      <FlatList
        data={filteredAlbums} // Use filtered albums for rendering
        renderItem={renderAlbum}
        keyExtractor={(item) => item._id}
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
