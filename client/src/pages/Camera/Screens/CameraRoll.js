import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
import AlbumCard from "../Cards/AlbumCard";
import ShotCard from "../Cards/ShotCard";
import Icon from "../../../components/Icons/Icon";
import FormAlert from "../../../components/Alerts/FormAlert";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import { useCameraRoll } from "../../../contexts/CameraRollContext";

export default function CameraRoll() {
  const navigation = useNavigation();
  const [albumModalVisible, setAlbumModalVisible] = useState(false);

  const { albums, initializeAlbumCache, isAlbumCacheInitialized } =
    useCameraAlbums();
  const {
    shots,
    loadNextPage,
    initializeCameraRollCache,
    isCameraRollCacheInitialized,
    hasNextPage,
  } = useCameraRoll();

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Initialize caches on component mount
  useEffect(() => {
    const initializeCaches = async () => {
      try {
        console.log("isAlbumCacheInitialized", isAlbumCacheInitialized);
        console.log(
          "isCameraRollCacheInitialized",
          isCameraRollCacheInitialized
        );

        if (!isAlbumCacheInitialized) await initializeAlbumCache();
        if (!isCameraRollCacheInitialized) await initializeCameraRollCache();
      } catch (error) {
        console.error("[CameraRoll] Error initializing caches:", error);
      }
    };
    initializeCaches();
  }, [isAlbumCacheInitialized, isCameraRollCacheInitialized]);

  const handleCreateAlbum = (title) => {
    setAlbumModalVisible(false);
    navigation.navigate("CreateAlbum", { albumTitle: title });
  };

  const loadMoreShots = async () => {
    console.log("hasNextPage", hasNextPage);

    if (!hasNextPage || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      await loadNextPage();
    } catch (error) {
      console.error("[CameraRoll] Error fetching more shots:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const renderAlbumsSection = () => {
    const hasAlbums = albums.length > 0;

    return (
      <View>
        <Text style={[headerStyles.headerMedium, { marginLeft: 10 }]}>
          Albums
        </Text>
        {hasAlbums ? (
          <FlatList
            data={albums}
            renderItem={({ item }) => (
              <AlbumCard album={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={layoutStyles.paddingLeftXxs}
          />
        ) : (
          <Pressable
            style={styles.placeholderContainer}
            onPress={() => setAlbumModalVisible(true)}
            accessible
            accessibilityLabel="Create Album"
            accessibilityHint="Opens a modal to create a new album."
          >
            <Text style={styles.placeholderText}>Create Album</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderShotsSection = () => (
    <View style={layoutStyles.marginTopMd}>
      <Text style={[headerStyles.headerMedium, { marginLeft: 10 }]}>
        Camera Shots
      </Text>
      {shots.length > 0 ? (
        <FlatList
          data={shots}
          renderItem={({ item, index }) => (
            <ShotCard shot={item} navigation={navigation} index={index} />
          )}
          keyExtractor={(item) => item._id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            console.log("[CameraRoll] onEndReached triggered.");
            loadMoreShots();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
        />
      ) : (
        <Text style={styles.emptyStateText}>No camera shots available.</Text>
      )}
    </View>
  );

  const renderMainList = () => (
    <FlatList
      data={[{ key: "albums" }, { key: "shots" }]}
      renderItem={({ item }) =>
        item.key === "albums" ? renderAlbumsSection() : renderShotsSection()
      }
      keyExtractor={(item) => item.key}
      showsVerticalScrollIndicator={false}
      style={{ paddingTop: 12 }}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="Camera Roll"
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="folder.badge.plus"
            onPress={() => setAlbumModalVisible(true)}
            weight="semibold"
            style={iconStyles.createAlbum}
          />
        }
      />

      <FormAlert
        visible={albumModalVisible}
        title="New Album"
        subheader="Enter a name for this album."
        onRequestClose={() => setAlbumModalVisible(false)}
        onSave={handleCreateAlbum}
      />

      {isAlbumCacheInitialized && isCameraRollCacheInitialized ? (
        renderMainList()
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  emptyStateText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});
