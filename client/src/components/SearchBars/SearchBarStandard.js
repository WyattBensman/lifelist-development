import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { iconStyles } from "../../styles/iconStyles";
import Icon from "../../../source/icons/Icon";

const SearchBarStandard = forwardRef(
  ({ searchQuery, setSearchQuery, handleSearch, onFocusChange }, ref) => {
    const inputRef = useRef(null); // Internal ref for TextInput
    const [isFocused, setIsFocused] = useState(false);

    console.log("isFocused:", isFocused);
    console.log("searchQuery:", searchQuery);

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
            tintColor={"#fff"}
            fill={false}
            style={iconStyles.magnifyingGlass}
            noFill={true}
          />
        )}
        <TextInput
          ref={inputRef} // Attach the internal ref to TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#fff"
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 6,
    padding: 12,
  },
  input: {
    marginLeft: 4,
    color: "#fff",
  },
});

export default SearchBarStandard;
