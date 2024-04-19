import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import DeleteFlowpageLinkModal from "../Popups/DeleteFlowpageLinkModal";
import AddLink from "../Icons/AddLink";
import AddLinkForm from "../Forms/AddLinkForm";
import HeaderStack from "../../../components/Headers/HeaderStack";
import EditFlowPageLinkCard from "../Cards/EditFlowPageLinkCard";

export default function EditFlowPage() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  const toggleAddLinkForm = () => {
    setShowAddLinkForm(!showAddLinkForm);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Edit Flowpage"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={!showAddLinkForm && <AddLink onPress={toggleAddLinkForm} />}
      />
      <View style={layoutStyles.contentContainer}>
        {showAddLinkForm && (
          <AddLinkForm setShowAddLinkForm={setShowAddLinkForm} />
        )}
        <Text style={headerStyles.headerMedium}>Current Links</Text>
        <EditFlowPageLinkCard />
        <EditFlowPageLinkCard />
      </View>
      <DeleteFlowpageLinkModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
