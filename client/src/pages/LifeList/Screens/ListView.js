import { Pressable, StyleSheet, Text, View } from "react-native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchBarHeader from "../../../components/SearchBarHeader";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import ListItemCard from "../Cards/ListItemCard";
import { useEffect, useState } from "react";
import { useNavigationContext } from "../../../utils/NavigationContext";
import SaveDiscardContainer from "../Popups/SaveDiscardContainer";
import ActionModal from "../Popups/ActionsModal";
import { useRoute } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    if (route.params?.editMode) {
      setEditMode(true);
    }
  }, [route.params?.editMode]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={layoutStyles.container}>
      <SearchBarHeader
        arrowIcon={!editMode && <BackArrowIcon navigation={navigation} />}
        icon1={!editMode && <EditLifeListIcon onPress={toggleModal} />}
      />
      {!editMode && (
        <View style={[layoutStyles.flex, styles.buttonContainer]}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Experienced</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Wish Listed</Text>
          </Pressable>
        </View>
      )}
      <ListItemCard editMode={editMode} />

      {editMode && <SaveDiscardContainer toggleEditMode={toggleEditMode} />}

      <ActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onEditExperiences={() => {
          setModalVisible(false);
          setEditMode(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 25,
    marginTop: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    paddingVertical: 5,
    width: 165,
  },
  buttonText: {
    textAlign: "center",
  },
});
