import { ScrollView, StyleSheet, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import EditLogbookIcon from "../icons/EditLogbookIcon";
import OngoingUpcomingExperiences from "../Components/OngoingUpcomingExperiences";

import { useEffect, useState } from "react";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigationContext } from "../../../utils/NavigationContext";
import AddUpcomingExperienceModal from "../Popups/AddUpcomingExperienceModal";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "../../../utils/ThemeContext";
import BottomContainer from "../../../components/BottomContainer";
import SolidButton from "../../../components/SolidButton";
import StartAddButtons from "../Components/StartAddButtons";
import DiscardDeleteButtons from "../Components/DiscardDeleteButtons";

export default function Logbook({ navigation }) {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StackHeader
        arrow={!editMode && <BackArrowIcon navigation={navigation} />}
        title={!editMode ? "Logbook" : "Edit Logbook"}
        button1={!editMode && <EditLogbookIcon onPress={toggleEditMode} />}
      />
      <ScrollView style={styles.contentContainer}>
        <Text style={[styles.header, editMode && styles.editModeHeader]}>
          Create & continuous update collages before sharing, or plan for
          upcoming experiences
        </Text>
        <OngoingUpcomingExperiences editMode={editMode} />
        <AddUpcomingExperienceModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
        />
      </ScrollView>
      {!editMode ? (
        <StartAddButtons toggleModal={toggleModal} />
      ) : (
        <DiscardDeleteButtons toggleEditMode={toggleEditMode} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
