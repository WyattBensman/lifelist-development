import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
import { Camera, useCameraPermissions } from "expo-camera"; // Updated import for useCameraPermissions
import * as SMS from "expo-sms";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";
import { layoutStyles, iconStyles } from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ShareEarlyAccessScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasContactsPermission, setHasContactsPermission] = useState(null);
  const [permissionsChecked, setPermissionsChecked] = useState(false); // Prevent repeated permission checks
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [invitedFriends, setInvitedFriends] = useState([null, null, null]);
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();

  // Camera Permissions Hook
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Validate that all invite slots are filled
  const validateInvites = () => {
    const allFilled = invitedFriends.every((friend) => friend !== null);
    setIsValid(allFilled);
  };

  useEffect(() => {
    validateInvites();
  }, [invitedFriends]);

  useEffect(() => {
    if (!permissionsChecked) {
      checkPermissions(); // Call the permission check only once
    }

    // Log the stored data when the component mounts
    logStoredData();
  }, [permissionsChecked]);

  // Function to check both camera and contacts permissions
  const checkPermissions = async () => {
    try {
      // Request Camera and Contacts permissions simultaneously
      const [cameraStatus, contactsStatus] = await Promise.all([
        requestCameraPermission(),
        Contacts.requestPermissionsAsync(),
      ]);

      console.log(cameraStatus.status);
      console.log(contactsStatus.status);

      // Check if permissions are granted
      const cameraGranted = cameraStatus.status === "granted";
      const contactsGranted = contactsStatus.status === "granted";

      setHasCameraPermission(cameraGranted);
      setHasContactsPermission(contactsGranted);

      // If both permissions are granted, fetch contacts
      if (cameraGranted && contactsGranted) {
        fetchContacts();
      } else {
        // Show alerts for missing permissions
        if (!cameraGranted)
          Alert.alert("Error", "Camera permission is required.");
        if (!contactsGranted)
          Alert.alert("Error", "Contacts permission is required.");
      }

      setPermissionsChecked(true); // Mark permissions as checked
    } catch (error) {
      console.error("Error checking permissions: ", error);
    }
  };

  // Fetch contacts if permissions are granted
  const fetchContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        Alert.alert(
          "No Contacts Found",
          "No contacts were found on your device."
        );
      }
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    }
  };

  // Function to log the stored onboarding data
  const logStoredData = async () => {
    try {
      const userData = await AsyncStorage.getItem("signupData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log("Stored Onboarding Data: ", parsedUserData);
      } else {
        console.log("No onboarding data found in storage.");
      }
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage: ", error);
    }
  };

  // Handle navigation to the final step
  const handleNextStep = () => {
    if (isValid) {
      navigation.navigate("FinalStepPage", { invitedFriends });
    }
  };

  // Add friend to invited slots and send SMS invitation
  const inviteFriend = async (contact) => {
    const inviteCode = "123456"; // Replace this with your actual invite code
    const message = `Hey ${contact.name}, join me on this amazing app using this code: ${inviteCode}`;

    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const { result } = await SMS.sendSMSAsync(
        [contact.phoneNumbers[0].number],
        message
      );

      if (result === "sent") {
        Alert.alert(
          "Success",
          `${contact.name} has been invited successfully!`
        );
        addFriend(contact);
      } else {
        Alert.alert("Failed", "Message could not be sent.");
      }
    } else {
      Alert.alert(
        "No Phone Number",
        `${contact.name} has no available phone number.`
      );
    }
  };

  // Add a friend to the invitedFriends slots
  const addFriend = (contact) => {
    const emptySlotIndex = invitedFriends.indexOf(null);
    if (emptySlotIndex !== -1) {
      const updatedFriends = [...invitedFriends];
      updatedFriends[emptySlotIndex] = contact;
      setInvitedFriends(updatedFriends);
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phoneNumbers &&
        contact.phoneNumbers.some((pn) => pn.number.includes(searchQuery)))
  );

  // Render contact item for the invite list
  const renderInviteFriendItem = ({ item }) => (
    <Pressable style={styles.contactItem} onPress={() => inviteFriend(item)}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactNumber}>
        {item.phoneNumbers ? item.phoneNumbers[0].number : "No Phone Number"}
      </Text>
    </Pressable>
  );

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header Section */}
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"} // Green if valid, gray if not
            style={iconStyles.backArrow}
            onPress={isValid ? handleNextStep : null}
          />
        }
        hasBorder={false}
      />

      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>4 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Container Middle */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Final Step</Text>
          <Text style={styles.mainTitle}>Don’t Be Alone</Text>
          <Text style={styles.subtitle}>
            Invite 3 of your friends to join you for early access to the
            application.
          </Text>

          {/* Container for Search Bar and Contacts List */}
          <View style={styles.contactListContainer}>
            {/* Search Bar */}
            <SearchBarStandard
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={() => {}}
              onFocusChange={() => {}}
            />

            {/* Contact List */}
            <FlatList
              data={filteredContacts}
              renderItem={renderInviteFriendItem}
              keyExtractor={(item) => item.id}
              style={styles.contactList}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>

          {/* Friends Invites Section */}
          <View style={styles.inviteSlotsContainer}>
            {invitedFriends.map((friend, index) => (
              <View
                key={index}
                style={[styles.inviteSlot, friend && styles.inviteSlotFilled]}
              >
                <Text style={styles.inviteSlotText}>
                  {friend ? friend.name : "Invite Friend"}
                </Text>
              </View>
            ))}
          </View>

          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Start Your Journey"
            onPress={isValid ? handleNextStep : null}
          />
        </View>

        <View style={styles.bottomContainer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    marginTop: -4,
  },
  stepIndicator: {
    color: "#6AB952",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    flexDirection: "row",
    marginBottom: 24,
  },
  progressBarFilled: {
    flex: 1,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarEmpty: {
    flex: 0,
    backgroundColor: "#1c1c1c",
  },
  middleContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 48,
  },
  stepTitle: {
    color: "#6AB952",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "left",
    width: "80%",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    width: "80%",
    marginBottom: 8,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 14,
    textAlign: "left",
    width: "80%",
    marginBottom: 24,
  },
  contactListContainer: {
    backgroundColor: "#252525",
    borderRadius: 8,
    width: "90%",
    maxHeight: 320,
    minHeight: 320,
    padding: 16,
  },
  contactList: {
    marginTop: 12,
  },
  inviteSlotsContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  inviteSlot: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1c1c1c",
  },
  inviteSlotFilled: {
    backgroundColor: "#6AB95230",
    borderColor: "#6AB95250",
  },
  inviteSlotText: {
    color: "#c7c7c7",
    textAlign: "center",
    fontSize: 12,
    margin: 4,
  },
  contactItem: {
    padding: 12,
    backgroundColor: "#1c1c1c",
    borderRadius: 8,
    marginVertical: 4,
  },
  contactName: {
    color: "#fff",
    fontWeight: "600",
  },
  contactNumber: {
    color: "#c7c7c7",
    fontSize: 12,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    marginBottom: 32,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
});

/*   useEffect(() => {
    console.log("New Logggggxxx:");
    console.log("Camera Permission State:", cameraPermission);
    console.log("Contacts Permission State:", contactsPermission);
  }, [cameraPermission, contactsPermission]);

  // Function to dynamically check both camera and contacts permissions
  const checkPermissions = async () => {
    try {
      // Check camera permission using the hook
      if (!cameraPermission || cameraPermission.status !== "granted") {
        const { status } = await requestCameraPermission(); // Request permission if not granted
        if (status === "granted") {
          setContactsPermission(true);
        } else {
          setContactsPermission(false);
        }
      }

      // Check contacts permission
      const { status: contactsStatus } = await Contacts.getPermissionsAsync();
      const isContactsGranted = contactsStatus === "granted";
      setContactsPermission(isContactsGranted);

      // If either permission is missing, show alert and navigate back
      if (!cameraPermission?.granted || !isContactsGranted) {
        showPermissionsAlert(cameraPermission?.granted, isContactsGranted);
      }

      // If contacts permission is granted, fetch contacts
      if (isContactsGranted) {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    } catch (error) {
      console.error("Failed to check or fetch permissions: ", error);
    }
  };

  // Show alert for missing permissions and navigate back to the permissions screen
  const showPermissionsAlert = (isCameraGranted, isContactsGranted) => {
    const missingPermissions = [];
    if (!isCameraGranted) missingPermissions.push("Camera");
    if (!isContactsGranted) missingPermissions.push("Contacts");

    Alert.alert(
      "Permissions Required",
      `The following permissions are required to continue: ${missingPermissions.join(
        ", "
      )}`,
      [
        {
          text: "Go Back to Permissions",
          onPress: () => navigation.navigate("SetPermissions"), // Navigate back to permissions screen
        },
      ]
    );
  };

  // Check permissions every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      checkPermissions();
    }, [cameraPermission]) // Re-run if cameraPermission changes
  ); */
