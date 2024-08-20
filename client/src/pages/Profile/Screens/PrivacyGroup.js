import React, { useState, useEffect, useRef } from "react";
import { FlatList, Text, View, Animated } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
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
import {
  DELETE_PRIVACY_GROUP,
  REMOVE_USERS_FROM_PRIVACY_GROUP,
} from "../../../utils/mutations/index";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function PrivacyGroup() {
  const navigation = useNavigation();
  const route = useRoute();
  const privacyGroupId = route.params.privacyGroupId;
  const initialEditMode = route.params.editMode || false;
  const fromAddUsers = route.params.fromAddUsers || false;
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const { data, loading, error, refetch } = useQuery(GET_PRIVACY_GROUP, {
    variables: { privacyGroupId },
  });

  const [deletePrivacyGroup] = useMutation(DELETE_PRIVACY_GROUP, {
    onCompleted: () => {
      setModalVisible(false);
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Error deleting privacy group:", error);
    },
  });

  const [removeUsersFromPrivacyGroup] = useMutation(
    REMOVE_USERS_FROM_PRIVACY_GROUP,
    {
      onCompleted: () => {
        setSelectedUsers([]);
        setIsEditMode(false);
        refetch();
      },
      onError: (error) => {
        console.error("Error removing users from privacy group:", error);
      },
    }
  );

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
    if (fromAddUsers) {
      navigation.navigate("PrivacyGroups");
    } else if (isEditMode) {
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
    removeUsersFromPrivacyGroup({
      variables: {
        privacyGroupId: privacyGroupId,
        userIds: selectedUsers,
      },
    });
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
        title={data.getPrivacyGroup.groupName}
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
        onConfirm={() => deletePrivacyGroup({ variables: { privacyGroupId } })}
      />
    </View>
  );
}
