import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";

export default function FriendRequestCard({
  fullName,
  profilePicture,
  username,
}) {
  return (
    <View style={styles.container}>
      <View style={layoutStyles.flexRowSpace}>
        <Image source={{ uri: profilePicture }} style={styles.image} />
        <View>
          <Text style={cardStyles.primaryText}>{fullName}</Text>
          <Text style={cardStyles.secondaryText}>wants to be your friend.</Text>
        </View>
      </View>
      <View style={layoutStyles.flexRow}>
        <ButtonSmall
          text={"Accept"}
          textColor={"#ffffff"}
          backgroundColor={"#5FAF46"}
        />
        <ButtonSmall
          text={"Decline"}
          textColor={"#000000"}
          backgroundColor={"#ececec"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...cardStyles.userCardContainer,
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 6,
  },
});
