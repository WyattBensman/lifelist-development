import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "../Icons/Icon";
import { iconStyles } from "../../styles/iconStyles";

const SearchBarStandard = forwardRef(
  ({ searchQuery, setSearchQuery, handleSearch, onFocusChange }, ref) => {
    const inputRef = useRef(null); // Internal ref for TextInput
    const [isFocused, setIsFocused] = useState(false);

    // Expose the `blur` method to parent via the `ref`
    useImperativeHandle(ref, () => ({
      blur: () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      },
    }));

    return (
      <View style={styles.container}>
        {!isFocused && searchQuery === "" && (
          <Icon
            name="magnifyingglass"
            tintColor={"#d4d4d4"}
            fill={false}
            style={iconStyles.magnifyingGlass}
            noFill={true}
          />
        )}
        <TextInput
          ref={inputRef} // Attach the internal ref to TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#d4d4d4"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => {
            setIsFocused(true);
            onFocusChange(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            onFocusChange(false);
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    marginLeft: 4,
    color: "#d4d4d4",
  },
});

export default SearchBarStandard;
