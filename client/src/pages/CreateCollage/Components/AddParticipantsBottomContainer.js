import React from "react";
import OutlinedButton from "../../../components/OutlinedButton";
import BottomContainer from "../../../components/Containers/BottomContainer";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function AddParticipantsBottomContainer({
  onAdd,
  onDeselect,
  isAddDisabled,
  hasPreexistingTaggedUsers,
}) {
  return (
    <BottomContainer
      topButton={
        <ButtonSolid
          text={hasPreexistingTaggedUsers ? "Save Changes" : "Add Participants"}
          backgroundColor={isAddDisabled ? "#252525" : "#6AB95230"}
          borderColor={isAddDisabled ? "#252525" : "#6AB95250"}
          textColor={isAddDisabled ? "#696969" : "#6AB952"}
          onPress={onAdd}
          disabled={isAddDisabled}
        />
      }
      bottomButton={
        <OutlinedButton
          borderColor={"#1C1C1C"}
          text={hasPreexistingTaggedUsers ? "Discard Changes" : "Deselect All"}
          textColor={"#d4d4d4"}
          onPress={onDeselect}
        />
      }
    />
  );
}
