import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import UpcomingExperienceIcon from "../icons/UpcomingExperienceIcon";
import { useState } from "react";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";

export default function Upcomingitem({ editMode }) {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    if (editMode) {
      setSelected(!selected);
    } else {
      // Navigate to the appropriate screen
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.flex}>
        <View style={styles.flex}>
          <UpcomingExperienceIcon />
          <Text>Punta Cana Vacation</Text>
        </View>
        <View style={styles.flex}>
          {!editMode ? (
            <>
              <Text style={styles.editText}>Start</Text>
              <ForwardArrowIcon />
            </>
          ) : selected ? (
            <CheckedBoxIcon />
          ) : (
            <UncheckedBoxIcon />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: "rgba(212, 212, 212, 0.50)",
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editText: {
    fontSize: 10,
  },
});
