import React, { useState, useEffect, useRef } from "react";
import { FlatList, Text, View, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import UserPrivacyGroupCard from "../Cards/UserPrivacyGroupCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import DeletePrivacyGroupModal from "../Popups/DeletePrivacyGroupModal";
import BottomContainer from "../../../components/Containers/BottomContainer";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import OutlinedButton from "../../../components/OutlinedButton";
import { GET_PRIVACY_GROUP } from "../../../utils/queries/privacyGroupQueries";
import Icon from "../../../components/Icons/Icon";

export default function PrivacyGroup() {
  const navigation = useNavigation();
  const route = useRoute();
  const privacyGroupId = route.params.privacyGroupId;
  const [isEditMode, setIsEditMode] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { data, loading, error } = useQuery(GET_PRIVACY_GROUP, {
    variables: { privacyGroupId },
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAddUsers = () => {
    setDropdownVisible(false);
    navigation.navigate("AddUsersToPrivacyGroup", {
      privacyGroupId: privacyGroupId,
    });
  };

  const handleEditGroup = () => {
    setIsEditMode(true);
    setDropdownVisible(false);
  };

  const handleDeleteGroup = () => {
    setModalVisible(true);
    setDropdownVisible(false);
  };

  const handleBackPress = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setSelectedUsers([]);
    } else {
      navigation.goBack();
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleRemoveUsers = () => {
    // Implement user removal logic here
    console.log("Remove Users:", selectedUsers);
    setSelectedUsers([]);
    setIsEditMode(false);
  };

  const handleDiscardChanges = () => {
    setSelectedUsers([]);
    setIsEditMode(false);
  };

  const dropdownItems = [
    {
      icon: "plus",
      style: iconStyles.plus,
      label: "Add Users",
      onPress: handleAddUsers,
      backgroundColor: "#6AB95230", // Add backgroundColor
      tintColor: "#6AB952", // Add tintColor
    },
    {
      icon: "pencil.slash",
      style: iconStyles.removeShots,
      label: "Edit Group",
      onPress: handleEditGroup,
      backgroundColor: "#5FC4ED30", // Add backgroundColor
      tintColor: "#5FC4ED", // Add tintColor
    },
    {
      icon: "trash",
      style: iconStyles.trash,
      label: "Delete Group",
      onPress: handleDeleteGroup,
      backgroundColor: "#E5393530", // Very Light Pink Background
      tintColor: "#E53935", // Slightly Darker Red
    },
  ];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderUserPrivacyGroupCard = ({ item }) => (
    <UserPrivacyGroupCard
      isEditMode={isEditMode}
      fullName={item.fullName}
      username={item.username}
      profilePicture={item.profilePicture}
      isSelected={selectedUsers.includes(item._id)}
      onSelect={() => handleUserSelect(item._id)}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Cool Guys"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          !isEditMode && (
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Icon
                name="ellipsis"
                style={iconStyles.ellipsis}
                weight="bold"
                onPress={toggleDropdown}
              />
            </Animated.View>
          )
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <FlatList
        data={data.getPrivacyGroup.users}
        renderItem={renderUserPrivacyGroupCard}
        keyExtractor={(item) => item._id.toString()}
      />
      {isEditMode && selectedUsers.length > 0 && (
        <BottomContainer
          topButton={
            <ButtonSolid
              text="Remove Users"
              backgroundColor="#E53935"
              borderColor="#E53935"
              textColor="#fff"
              onPress={handleRemoveUsers}
            />
          }
          bottomButton={
            <OutlinedButton
              borderColor={"#1C1C1C"}
              text={"Discard"}
              textColor={"#d4d4d4"}
              onPress={handleDiscardChanges}
            />
          }
        />
      )}
      <DeletePrivacyGroupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirm={() => console.log("Delete Group Confirmed")}
      />
    </View>
  );
}
