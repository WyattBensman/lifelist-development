import { Pressable, StyleSheet, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import EditLogbookIcon from "../icons/EditLogbookIcon";
import OngoingUpcomingExperiences from "../Components/OngoingUpcomingExperiences";

import { useState } from "react";
import LogbookButtons from "../Components/LogbookButtons";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";

export default function Logbook({ navigation }) {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(true);
  };

  return (
    <View style={styles.container}>
      <StackHeader
        arrow={!editMode && <BackArrowIcon navigation={navigation} />}
        title={!editMode ? "Logbook" : "Edit Logbook"}
        button1={!editMode && <EditLogbookIcon onPress={toggleEditMode} />}
      />
      <View style={styles.contentContainer}>
        <Text style={[styles.header, editMode && styles.editModeHeader]}>
          Create & continuous update collages before sharing, or plan for
          upcoming experiences
        </Text>

        <OngoingUpcomingExperiences editMode={editMode} />
        {!editMode && <LogbookButtons />}
        <Pressable onPress={() => setEditMode(false)}>
          <Text>Hey</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 25,
  },
  header: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
  editModeHeader: {
    color: "#D4D4D4",
  },
});
