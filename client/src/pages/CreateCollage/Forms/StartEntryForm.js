import { StyleSheet, Text, TextInput, View } from "react-native";
import { cardStyles, formStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function StartEntryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <View style={[layoutStyles.wrapper, layoutStyles.marginTopMd]}>
      <View style={[cardStyles.entryCardContainer, { paddingBottom: 16 }]}>
        <TextInput
          style={formStyles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="Entry title"
        />
        <TextInput
          style={[formStyles.input, layoutStyles.marginTopSm, { height: 100 }]}
          onChangeText={setContent}
          value={content}
          placeholder="Entry content"
          multiline={true}
        />
      </View>
      <View style={layoutStyles.buttonContainer}>
        <ButtonSolid
          backgroundColor="#6AB952"
          textColor="#FFFFFF"
          text="Add Entry"
          width="47%"
        />
        <ButtonSolid backgroundColor="#ececec" text="Discard" width="47%" />
      </View>
    </View>
  );
}
