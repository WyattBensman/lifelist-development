import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonSkinny from "../../../components/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";

export default function ProfileOverview() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={styles.image}
        />
        <View style={styles.rightContainer}>
          <View style={styles.flex}>
            <View style={styles.col}>
              <Text style={styles.number}>17</Text>
              <Text style={styles.description}>Collages</Text>
            </View>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Followers" })
              }
            >
              <Text style={styles.number}>851</Text>
              <Text style={styles.description}>Followers</Text>
            </Pressable>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Following" })
              }
            >
              <Text style={styles.number}>322</Text>
              <Text style={styles.description}>Following</Text>
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
      <View style={styles.userContainer}>
        <Text style={styles.username}>@wyattbensman</Text>
        <Text style={styles.caption}>
          Hey how are ya? I guess this is my bio?
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginBottom: 5,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  rightContainer: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 9,
    justifyContent: "space-between",
    height: "100%",
  },
  col: {
    alignItems: "center",
  },
  number: {
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  userContainer: {
    marginTop: 10,
  },
  username: {
    fontWeight: "500",
  },
  caption: {
    marginTop: 5,
  },
});

{
  /* <Pressable
style={styles.col}
onPress={() => navigation.navigate('UserRelations', { screen: 'Followers' })} // Navigate to UserRelations screen, followers tab
>
<Text style={styles.number}>851</Text>
<Text style={styles.description}>Followers</Text>
</Pressable>
<Pressable
style={styles.col}
onPress={() => navigation.navigate('UserRelations', { screen: 'Following' })} // Navigate to UserRelations screen, following tab
>
<Text style={styles.number}>322</Text>
<Text style={styles.description}>Following</Text>
</Pressable> */
}

{
  /* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ButtonSkinny
            text="Following"
            backgroundColor="#6AB952"
            textColor="#ffffff"
            width={112.5}
          />
          <ButtonSkinny
            text="Message"
            backgroundColor="#ececec"
            textColor="#262828"
            width={112.5}
          />
        </View> */
}
