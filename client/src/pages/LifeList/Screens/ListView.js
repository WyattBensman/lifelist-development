import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import SaveDiscardContainer from "../Popups/SaveDiscardContainer";
import ActionModal from "../Popups/ActionsModal";
import ListViewNavigator from "../Navigation/ListViewNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewType, setViewType] = useState("EXPERIENCED");

  const { currentUser } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser._id },
  });

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

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const lifeList = data.getUserLifeList;

  return (
    <View style={layoutStyles.container}>
      <HeaderSearchBar
        arrowIcon={!editMode && <BackArrowIcon navigation={navigation} />}
        icon1={
          !editMode && (
            <EditLifeListIcon onPress={() => setEditMode(!editMode)} />
          )
        }
        hasBorder={false}
      />
      <View style={[layoutStyles.flex, styles.buttonContainer]}>
        <Pressable
          style={[
            styles.button,
            viewType === "EXPERIENCED" && styles.selectedButton,
          ]}
          onPress={() => handleViewTypeChange("EXPERIENCED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "EXPERIENCED" && styles.selectedButtonText,
            ]}
          >
            Experienced
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            viewType === "WISHLISTED" && styles.selectedButton,
          ]}
          onPress={() => handleViewTypeChange("WISHLISTED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "WISHLISTED" && styles.selectedButtonText,
            ]}
          >
            Wish Listed
          </Text>
        </Pressable>
      </View>
      <ListViewNavigator
        lifeList={lifeList}
        viewType={viewType}
        editMode={editMode}
      />
      {editMode && <SaveDiscardContainer toggleEditMode={toggleEditMode} />}
    </View>
  );
}

{
  /*       <ActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onEditExperiences={() => {
          setModalVisible(false);
          setEditMode(true);
        }}
      /> */
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 24,
    marginTop: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 4,
    paddingVertical: 5,
    width: 165,
  },
  buttonText: {
    textAlign: "center",
  },
  selectedButton: {
    backgroundColor: "#6AB952",
    borderColor: "#6AB952",
  },
  selectedButtonText: {
    color: "#fff",
  },
});
