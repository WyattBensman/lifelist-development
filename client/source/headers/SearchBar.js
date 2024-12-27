import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, TextInput } from "react-native";
import Icon from "../icons/Icon";
import { formStyles } from "../styles/components/formStyles";
import { symbolStyles } from "../styles/components/symbolStyles";

const SearchBar = forwardRef(
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
      <View style={formStyles.searchContainer}>
        {!isFocused && searchQuery === "" && (
          <Icon
            name="magnifyingglass"
            tintColor={"#fff"}
            fill={false}
            style={symbolStyles.magnifyingGlass}
            noFill={true}
          />
        )}
        <TextInput
          ref={inputRef} // Attach the internal ref to TextInput
          style={formStyles.searchInput}
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

export default SearchBar;
