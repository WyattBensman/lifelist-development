import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import BlurredShotCard from "../Cards/BlurredShotCard";
import MessageAlert from "../../../components/Alerts/MessageAlert";
import ViewDevelopingShot from "../Cards/ViewDevelopingShot";
import { useDevelopingRoll } from "../../../contexts/DevelopingRollContext";

const { width } = Dimensions.get("window");

export default function DevelopingRoll() {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedShot, setSelectedShot] = useState(null);

  // Access DevelopingRoll context
  const {
    developingShots,
    recalculateDevelopedStatus,
    updateShotInDevelopingRoll,
    initializeDevelopingRollCache,
    isDevelopingRollCacheInitialized,
  } = useDevelopingRoll();

  // Initialize cache when component mounts
  useEffect(() => {
    if (!isDevelopingRollCacheInitialized) {
      initializeDevelopingRollCache(); // Ensure cache is populated if not already initialized
    }
  }, [isDevelopingRollCacheInitialized, initializeDevelopingRollCache]);

  // Recalculate developed status whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      recalculateDevelopedStatus();
    }, [recalculateDevelopedStatus]) // Use only stable dependencies
  );

  const toggleAlert = () => {
    setAlertVisible(!alertVisible);
  };

  const handleShotPress = (shot) => {
    if (shot.isDeveloped) {
      setSelectedShot(shot);
    }
  };

  const closeDevelopedShot = () => {
    setSelectedShot(null);
  };

  const handleShotDeveloped = (shotId) => {
    updateShotInDevelopingRoll(shotId, { isDeveloped: true }); // Update shot in cache
  };

  if (!isDevelopingRollCacheInitialized) {
    return (
      <View style={layoutStyles.wrapper}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading developing shots...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={!selectedShot && "In Development"}
        arrow={
          !selectedShot && (
            <Icon
              name="chevron.backward"
              onPress={() => navigation.goBack()}
              style={iconStyles.backArrow}
              weight="semibold"
            />
          )
        }
        button1={
          !selectedShot && (
            <Icon
              name="info"
              style={iconStyles.info}
              weight="semibold"
              onPress={toggleAlert}
            />
          )
        }
      />

      {developingShots.length > 0 ? (
        <FlatList
          data={developingShots}
          renderItem={({ item }) => (
            <BlurredShotCard
              shot={item}
              onShotDeveloped={handleShotDeveloped}
              onPress={() => handleShotPress(item)} // Open overlay on press
            />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyStateText}>No developing shots found.</Text>
      )}

      <MessageAlert
        visible={alertVisible}
        onRequestClose={toggleAlert}
        message="Camera Shots will be fully developed by 6am tomorrow!"
      />

      {selectedShot && (
        <BlurView intensity={25} style={StyleSheet.absoluteFill}>
          <ViewDevelopingShot
            shotId={selectedShot._id}
            onClose={closeDevelopedShot}
          />
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyStateText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#0000ff",
  },
});
