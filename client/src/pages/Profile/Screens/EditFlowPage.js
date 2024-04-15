import { Text, TextInput, View } from "react-native";
import {
  formStyles,
  headerStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import Facebook from "../Icons/FlowpageIcons/Facebook";
import DeleteIcon from "../Icons/DeleteIcon";
import { useState } from "react";
import DeleteFlowpageLinkModal from "../Popups/DeleteFlowpageLinkModal";
import AddLink from "../Icons/AddLink";
import AddLinkForm from "../Forms/AddLinkForm";

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
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Edit Flowpage"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={!showAddLinkForm && <AddLink onPress={toggleAddLinkForm} />}
      />
      <View style={[layoutStyles.contentContainer, { marginTop: 16 }]}>
        {showAddLinkForm && (
          <AddLinkForm setShowAddLinkForm={setShowAddLinkForm} />
        )}
        <Text style={headerStyles.headerMedium}>Current Links</Text>
        <View
          style={[
            popupStyles.cardContainer,
            layoutStyles.flex,
            { marginHorizontal: 2, borderTopWidth: 0 },
          ]}
        >
          <View style={layoutStyles.flexRow}>
            <Facebook />
            <Text style={popupStyles.spacer}>Facebook</Text>
          </View>
          <DeleteIcon onPress={toggleModal} />
        </View>
        <TextInput style={[formStyles.input, { marginBottom: 8 }]}>
          Hi
        </TextInput>
      </View>
      <DeleteFlowpageLinkModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
