import React from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../../styles";
import { symbolStyles } from "../../styles/components/symbolStyles";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../icons/Icon";

export default function ParticipantCard({ participant, onRequestClose }) {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: participant._id },
    });
    onRequestClose();
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={handleProfilePress}
        style={[cardStyles.contentContainer, { marginBottom: 8 }]}
      >
        {/* Profile Image */}
        <Image
          source={{ uri: participant.profilePicture }}
          style={cardStyles.imageMd}
        />
        {/* Text Container */}
        <View style={cardStyles.textContainer}>
          <Text style={cardStyles.primaryText}>{participant.fullName}</Text>
          <Text style={cardStyles.secondaryText}>@{participant.username}</Text>
        </View>
        {/* Chevron Icon */}
        <Icon
          name="chevron.forward"
          style={symbolStyles.forwardArrow}
          weight="semibold"
        />
      </Pressable>
    </View>
  );
}
