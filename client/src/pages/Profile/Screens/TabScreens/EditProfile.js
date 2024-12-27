import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import IconStatic from "../../../../components/Icons/IconStatic";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import { useAdminProfile } from "../../../../contexts/AdminProfileContext"; // Updated import
import { BASE_URL } from "../../../../utils/config";
import { Picker } from "@react-native-picker/picker";

export default function EditProfileTab() {
  const {
    adminProfile,
    updateAdminProfileField,
    saveAdminProfile,
    resetAdminChanges,
    unsavedChanges,
  } = useAdminProfile(); // Updated to use AdminProfileContext

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [temporaryGender, setTemporaryGender] = useState("");
  const [temporaryBirthday, setTemporaryBirthday] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      updateAdminProfileField("profilePicture", result.uri);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const [month, day, year] = formattedDate.split(" ");
    const dayWithSuffix = day
      .replace(",", "")
      .concat(getDaySuffix(parseInt(day)));
    return `${month} ${dayWithSuffix}, ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleBirthdaySave = () => {
    if (temporaryBirthday) {
      updateAdminProfileField("birthday", temporaryBirthday.toISOString());
      setShowBirthdayPicker(false);
    }
  };

  const profilePictureUrl = adminProfile?.profilePicture;

  return (
    <KeyboardAvoidingView
      style={layoutStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={formStyles.formContainer}
        keyboardDismissMode="on-drag"
      >
        <Text style={[headerStyles.headerMedium, { marginBottom: 12 }]}>
          Profile Information
        </Text>
        <Pressable
          onPress={pickImage}
          style={[layoutStyles.marginBtmSm, styles.profileContainer]}
        >
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profilePicture}
          />
          <Pressable onPress={pickImage}>
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </Pressable>
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={adminProfile?.fullName || ""}
            onChangeText={(value) => updateAdminProfileField("fullName", value)}
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={adminProfile?.username || ""}
            onChangeText={(value) => updateAdminProfileField("username", value)}
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={adminProfile?.bio || ""}
            onChangeText={(value) => updateAdminProfileField("bio", value)}
            style={styles.input}
            placeholder="Tell us about yourself"
            placeholderTextColor="#d4d4d4"
            multiline={true}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Pressable
            style={styles.input}
            onPress={() => {
              setTemporaryGender(adminProfile?.gender || "");
              setShowGenderPicker(true);
            }}
          >
            <Text style={{ color: adminProfile?.gender ? "#fff" : "#d4d4d4" }}>
              {adminProfile?.gender
                ? adminProfile.gender.charAt(0).toUpperCase() +
                  adminProfile.gender.slice(1).toLowerCase()
                : "Select your gender"}
            </Text>
            <IconStatic
              name="chevron.down"
              style={styles.icon}
              tintColor="#d4d4d4"
              weight="regular"
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Birthday</Text>
          <Pressable
            style={styles.input}
            onPress={() => {
              setTemporaryBirthday(new Date(adminProfile?.birthday || ""));
              setShowBirthdayPicker(true);
            }}
          >
            <Text
              style={{ color: adminProfile?.birthday ? "#fff" : "#d4d4d4" }}
            >
              {adminProfile?.birthday
                ? formatDate(adminProfile.birthday)
                : "Select your birthday"}
            </Text>
            <IconStatic
              name="chevron.down"
              style={styles.icon}
              tintColor="#d4d4d4"
              weight="regular"
            />
          </Pressable>
        </View>
      </ScrollView>
      {unsavedChanges && (
        <EditProfileBottomContainer
          saveChanges={saveAdminProfile}
          discardChanges={resetAdminChanges}
        />
      )}

      {/* Gender Picker Modal */}
      <Modal
        isVisible={showGenderPicker}
        onBackdropPress={() => setShowGenderPicker(false)}
        style={styles.modal}
      >
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={temporaryGender}
            onValueChange={(itemValue) => setTemporaryGender(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Non-binary" value="Non-binary" />
          </Picker>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.discardButton}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                updateAdminProfileField("gender", temporaryGender);
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Birthday Picker Modal */}
      {showBirthdayPicker && (
        <Modal
          isVisible={showBirthdayPicker}
          onBackdropPress={() => setShowBirthdayPicker(false)}
          style={styles.modal}
        >
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={temporaryBirthday || new Date()}
              mode="date"
              display="spinner"
              textColor="#fff"
              onChange={(event, selectedDate) =>
                setTemporaryBirthday(selectedDate)
              }
              style={{ width: "100%" }}
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.discardButton}
                onPress={() => setShowBirthdayPicker(false)}
              >
                <Text style={styles.discardButtonText}>Discard</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleBirthdaySave}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  changePictureText: {
    marginLeft: 12,
    color: "#fff",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    width: 76,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    padding: 9,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 16,
    height: 10,
    marginRight: 2,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  pickerContainer: {
    backgroundColor: "#1C1C1C",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 48,
  },
  pickerItem: {
    color: "#ececec",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 8,
  },
  discardButton: {
    flex: 1,
    height: 35,
    marginRight: 10,
    backgroundColor: "#252525",
    borderColor: "#d4d4d4",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  discardButtonText: {
    color: "#d4d4d4",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    height: 35,
    marginLeft: 10,
    backgroundColor: "#6AB95230",
    borderColor: "#6AB95250",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
