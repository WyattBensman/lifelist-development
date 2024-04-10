import { StyleSheet, View } from "react-native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchBarHeader from "../../../components/SearchBarHeader";
import { useTheme } from "../../../utils/ThemeContext";
import { globalStyling } from "../../../styles/GlobalStyling";
import EditLifeListIcon from "../Icons/EditLifeListIcon";
import OutlinedButton from "../../../components/OutlinedButton";
import ListItemCard from "../Cards/ListItemCard";
import { useEffect, useState } from "react";
import { useNavigationContext } from "../../../utils/NavigationContext";
import SolidButton from "../../../components/SolidButton";

export default function ListView({ navigation }) {
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <SearchBarHeader
        arrowIcon={<BackArrowIcon navigation={navigation} />}
        icon1={<EditLifeListIcon onPress={() => setEditMode(true)} />}
      />
      <View style={[globalStyling.flex, styles.buttonContainer]}>
        <OutlinedButton
          text={"Experienced"}
          borderColor={"#d4d4d4"}
          width={160}
        />
        <OutlinedButton
          text={"Wish Listed"}
          borderColor={"#d4d4d4"}
          width={160}
        />
      </View>
      <ListItemCard />
      <View style={styles.bottomContainer}>
        <View style={styles.contentContainer}>
          <SolidButton text={"Hey"} backgroundColor={"#d4d4d4"} />
          <SolidButton text={"Hey"} backgroundColor={"#d4d4d4"} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { marginHorizontal: 25, marginTop: 10 },
  bottomContainer: {
    borderTopColor: "#D4D4D4",
    borderWidth: 1,
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    contentContainer: {
      flex: 1,
      marginHorizontal: 25,
    },
  },
});

/* {editMode ? (
  <DiscardDeleteButtons toggleEditMode={toggleEditMode} />
) : (
  <StartAddButtons onAddPress={toggleModal} />
)} */
