import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import AddShotToAlbumCard from "../Cards/AddShotToAlbumCard";

export default function AddShotToAlbum({ navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { albums, initializeAlbumCache, isAlbumCacheInitialized, fetchAlbums } =
    useCameraAlbums();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const route = useRoute();
  const shotId = route.params.shotId;

  // Hide tab bar when component is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  // Initialize caches on component mount
  useEffect(() => {
    const initializeCaches = async () => {
      try {
        if (!isAlbumCacheInitialized) await initializeAlbumCache();
        if (isAlbumCacheInitialized) await fetchAlbums();
      } catch (error) {
        console.error("[AddShotToAlbum] Error initializing caches:", error);
      }
    };
    initializeCaches();
  }, [isAlbumCacheInitialized]);

  // Filter albums based on the search query
  const filteredAlbums = useMemo(() => {
    if (!searchQuery) {
      return albums; // Return all albums if search query is empty
    }
    return albums.filter((album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, albums]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderAlbum = ({ item }) => (
    <AddShotToAlbumCard key={item._id} album={item} shotId={shotId} />
  );

  if (!isAlbumCacheInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading albums...</Text>
      </View>
    );
  }

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No albums found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
});
