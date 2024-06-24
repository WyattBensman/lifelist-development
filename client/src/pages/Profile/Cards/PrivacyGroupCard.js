import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import IconStatic from "../../../components/Icons/IconStatic";
import DeletePrivacyGroupModal from "../Popups/DeletePrivacyGroupModal";

export default function PrivacyGroupCard({
  privacyGroup,
  isEditMode,
  onDelete,
}) {
  const navigation = useNavigation();
  const [individualEditMode, setIndividualEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleEditMode = () => {
    setIndividualEditMode(!individualEditMode);
  };

  const handleDelete = () => {
    onDelete(privacyGroup._id);
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isEditMode || individualEditMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isEditMode, individualEditMode]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handlePress = () => {
    if (!isEditMode && !individualEditMode) {
      navigation.navigate("PrivacyGroup", {
        privacyGroupId: privacyGroup._id,
      });
    }
  };

  return (
    <View style={styles.privacyGroupCard}>
      <Pressable onPress={handlePress} style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{privacyGroup.groupName}</Text>
          <Text style={styles.secondaryText}>
            {privacyGroup.users.length} Members
          </Text>
        </View>
        {!isEditMode && (
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              tintColor={"#696969"}
              style={iconStyles.ellipsis}
              noFill={true}
              onPress={toggleEditMode}
            />
          </Animated.View>
        )}
      </Pressable>
      {(isEditMode || individualEditMode) && (
        <View style={styles.optionsContainer}>
          <IconStatic
            name="trash"
            style={iconStyles.trashSm}
            tintColor={"#696969"}
            onPress={() => setModalVisible(true)}
          />
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[
                styles.optionsButton,
                styles.spacer,
                styles.editGroupButton,
              ]}
              onPress={() =>
                navigation.navigate("EditPrivacyGroup", {
                  privacyGroupId: privacyGroup._id,
                })
              }
            >
              <Text style={[styles.optionsText, styles.editGroupText]}>
                Edit Group
              </Text>
            </Pressable>
            <Pressable
              style={[styles.optionsButton, styles.spacer, styles.addButton]}
              onPress={() =>
                navigation.navigate("AddUsers", {
                  privacyGroupId: privacyGroup._id,
                })
              }
            >
              <Text style={[styles.optionsText, styles.addButtonText]}>
                Add Users
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      <DeletePrivacyGroupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  privacyGroupCard: {
    padding: 16,
    marginHorizontal: 4,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#1C1C1C",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 1.5,
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingLeft: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  optionsButton: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  spacer: {
    marginLeft: 8,
  },
  editGroupButton: {
    borderColor: "#696969",
    borderWidth: 1,
    backgroundColor: "#5FC4ED30",
  },
  editGroupText: {
    color: "#5FC4ED",
  },
  addButton: {
    borderColor: "#6AB95250",
    borderWidth: 1,
    backgroundColor: "#6AB95230",
  },
  addButtonText: {
    color: "#6AB952",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rotatedEllipsis: {
    transform: [{ rotate: "90deg" }],
  },
});
