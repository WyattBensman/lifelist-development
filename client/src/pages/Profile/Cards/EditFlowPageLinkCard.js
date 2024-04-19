import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { layoutStyles, formStyles } from "../../../styles";
import Facebook from "../Icons/FlowpageIcons/Facebook";
import DeleteIcon from "../Icons/DeleteIcon";
import DeleteFlowpageLinkModal from "../Popups/DeleteFlowpageLinkModal";

export default function EditFlowPageLinkCard() {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View>
      <View
        style={[
          layoutStyles.marginMd,
          layoutStyles.flex,
          { marginHorizontal: 2 },
        ]}
      >
        <View style={layoutStyles.flexRow}>
          <Facebook />
          <Text style={layoutStyles.marginLeftXxs}>Facebook</Text>
        </View>
        <DeleteIcon onPress={toggleModal} />
      </View>
      <TextInput
        style={[formStyles.input, layoutStyles.marginBtmSm]}
        defaultValue="www.igetnohoes.com"
      />
      <DeleteFlowpageLinkModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
