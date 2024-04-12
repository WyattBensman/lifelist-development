import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import ForwardArrowIcon from "../../../../icons/Universal/ForwardArrowIcon";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";

export default function EditProfileTab() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");

  return (
    <View style={layoutStyles.containerTab}>
      <ScrollView style={layoutStyles.contentContainer}>
        <View
          style={[
            styles.inputContainer,
            { alignItems: "center", marginTop: 16 },
          ]}
        >
          <Image
            source={require("../../../../../public/images/wyattbensman.png")}
            style={styles.image}
          />
          <Text style={{ marginTop: 4, fontWeight: "500" }}>
            Change Profile Picture
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={[layoutStyles.flex, { marginBottom: 16 }]}>
          <Text style={{ fontWeight: "500" }}>Flowpage</Text>
          <ForwardArrowIcon />
        </View>
        <Text style={[headerStyles.headerMedium, { marginTop: 8 }]}>
          Personal Information
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Birthday</Text>
          <TextInput
            value={birthday}
            onChangeText={setBirthday}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            style={styles.input}
          ></TextInput>
        </View>
      </ScrollView>
      {/* Only appears if a change was made */}
      <BottomContainer
        topButton={
          <SolidButton
            backgroundColor={"#d4d4d4"}
            text={"Save Changes"}
            textColor={"#ffffff"}
          />
        }
        bottomButton={
          <OutlinedButton borderColor={"#d4d4d4"} text={"Discard"} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 85,
    width: 85,
    borderRadius: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: "#D4D4D4",
  },
});
