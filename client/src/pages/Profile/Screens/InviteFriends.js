// /screens/InviteFriends.js

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
import InviteUserCard from "../Cards/InviteUserCard";

export default function InviteFriends() {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [registeredContacts, setRegisteredContacts] = useState([]);

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(GET_ALL_USERS);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (allUsersData && contacts.length > 0) {
      const registeredPhones = allUsersData.getAllUsers.map((user) =>
        user.phoneNumber.replace(/[^0-9]/g, "")
      );
      const registered = contacts.filter(
        (contact) =>
          contact.phoneNumbers &&
          contact.phoneNumbers.some((phone) =>
            registeredPhones.includes(phone.number.replace(/[^0-9]/g, ""))
          )
      );
      setRegisteredContacts(registered);
    }
  }, [allUsersData, contacts]);

  if (allUsersLoading) return <Text>Loading...</Text>;
  if (allUsersError) return <Text>Error: {allUsersError.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="Invite Friends"
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
      />
      <FlatList
        data={contacts}
        renderItem={({ item }) => (
          <InviteUserCard
            contact={item}
            isRegistered={registeredContacts.some((c) => c.id === item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your custom styles here
});
