import { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import RNPickerSelect from "react-native-picker-select";
import SolidButton from "../../../components/SolidButton";
import DownArrow from "../Icons/DownArrow";

export default function AddLinkForm({ setShowAddLinkForm }) {
  const [selectedLink, setSelectedLink] = useState("");
  const [url, setUrl] = useState("");

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={[layoutStyles.flexRow, { marginBottom: 12 }]}>
        <View
          style={[formStyles.flowpageLinkPlaceholder, { alignSelf: "center" }]}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedLink(value)}
          items={[
            { label: "Facebook", value: "Facebook" },
            { label: "Instagram", value: "Instagram" },
            { label: "X", value: "X" },
            { label: "Pinterest", value: "Pinterest" },
            { label: "Twitter", value: "Twitter" },
          ]}
          style={pickerSelectStyles}
          placeholder={{
            label: "Select a platform...",
            value: null,
          }}
          Icon={() => {
            return (
              <View style={styles.iconContainer}>
                <DownArrow />
              </View>
            );
          }}
        />
      </View>
      <TextInput
        placeholder="Add URL here"
        style={[formStyles.input, { marginBottom: 8 }]}
        value={url}
        onChangeText={setUrl}
      ></TextInput>
      <View style={formStyles.buttons}>
        <View style={{ flex: 1, marginRight: 4 }}>
          <SolidButton
            backgroundColor={"#f4f4f4"}
            text={"Discard"}
            textColor={"#000000"}
            onPress={() => setShowAddLinkForm(false)}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 4 }}>
          <SolidButton
            backgroundColor={"#34A853"}
            text={"Add Link"}
            textColor={"#ffffff"}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    right: 10, // Adjust based on your aesthetic preference
    transform: [{ translateY: 5 }], // Adjust based on the size of the icon for perfect centering
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    height: 36,
    width: 176,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    fontSize: 14,
    height: 36,
    width: 160,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    color: "black",
  },
});
