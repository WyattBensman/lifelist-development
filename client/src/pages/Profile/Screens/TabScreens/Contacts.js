import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import * as Contacts from "expo-contacts";
import InviteUserCard from "../../Cards/InviteUserCard";
import { layoutStyles } from "../../../../styles";

export default function InviteFriends({ searchQuery }) {
  const [contacts, setContacts] = useState([]);

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

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phoneNumbers &&
        contact.phoneNumbers.some((pn) => pn.number.includes(searchQuery)))
  );

  const renderInviteFriendItem = ({ item }) => (
    <InviteUserCard contact={item} />
  );

  return (
    <FlatList
      data={filteredContacts}
      renderItem={renderInviteFriendItem}
      keyExtractor={(item) => item.id}
      style={layoutStyles.wrapper}
    />
  );
}
