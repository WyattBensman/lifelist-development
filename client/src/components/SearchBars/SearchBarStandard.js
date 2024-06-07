import { View, TextInput, StyleSheet } from "react-native";
import SearchIcon from "../../pages/Inbox/Icons/SearchIcon";

export default function SearchBarStandard({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onFocusChange,
}) {
  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEF",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#000",
  },
  icon: {
    padding: 5,
  },
});
