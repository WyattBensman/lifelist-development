import { ScrollView, StyleSheet, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import { useEffect, useState } from "react";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigationContext } from "../../../utils/NavigationContext";
import AddUpcomingExperienceModal from "../Popups/AddUpcomingExperienceModal";
import StartAddContainer from "../Containers/StartAddContainer";
import DiscardDeleteContainer from "../Containers/DiscardDeleteContainer";
import ExperiencesContainer from "../Containers/ExperiencesContainer";
import ToggleEditIcon from "../Icons/ToggleEditIcon";
import { layoutStyles } from "../../../styles";

export default function Logbook({ navigation }) {
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
    <View style={layoutStyles.container}>
      <StackHeader
        arrow={!editMode && <BackArrowIcon navigation={navigation} />}
        title={!editMode ? "Logbook" : "Edit Logbook"}
        button1={!editMode && <ToggleEditIcon onPress={toggleEditMode} />}
      />
      <ScrollView style={layoutStyles.contentContainer}>
        <Text style={[styles.header, editMode && styles.editModeHeader]}>
          Create & continuous update collages before sharing, or plan for
          upcoming experiences
        </Text>
        <ExperiencesContainer editMode={editMode} />
        <AddUpcomingExperienceModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
        />
      </ScrollView>
      {!editMode ? (
        <StartAddContainer toggleModal={toggleModal} />
      ) : (
        <DiscardDeleteContainer toggleEditMode={toggleEditMode} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    marginVertical: 20,
  },
  editModeHeader: {
    color: "#D4D4D4",
  },
});
