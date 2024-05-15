import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonSkinny from "../../../components/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";

export default function ProfileOverview({ currentUser }) {
  const navigation = useNavigation();

  return (
    <View style={[layoutStyles.marginMd, layoutStyles.marginBtmXs]}>
      <View style={[layoutStyles.flex, { height: 100 }]}>
        <Image
          source={{ uri: currentUser.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.rightContainer}>
          <View
            style={[layoutStyles.flexSpaceBetween, layoutStyles.marginHorSm]}
          >
            <View style={styles.col}>
              <Text style={{ fontWeight: "700" }}>
                {currentUser.collages.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Collages</Text>
            </View>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Followers" })
              }
            >
              <Text style={{ fontWeight: "700" }}>
                {currentUser.followers.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Followers</Text>
            </Pressable>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Following" })
              }
            >
              <Text style={{ fontWeight: "700" }}>
                {currentUser.following.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Following</Text>
            </Pressable>
          </View>
          <ButtonSkinny
            onPress={() => navigation.navigate("EditProfile")}
            text="Edit Profile"
            backgroundColor="#ececec"
            textColor="#262828"
          />
        </View>
      </View>
      <View style={layoutStyles.marginTopXs}>
        <Text style={{ fontWeight: "500" }}>{currentUser.username}</Text>
        <Text style={layoutStyles.marginTopXxs}>{currentUser.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightContainer: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    height: "100%",
  },
  col: {
    alignItems: "center",
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
});
