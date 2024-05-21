import React from "react";
import BottomContainer from "../../../components/BottomContainer";
import OutlinedButton from "../../../components/OutlinedButton";
import SolidButton from "../../../components/SolidButton";

export default function AddExperiencesBottomContainer({
  onAdd,
  onDeselect,
  isAddDisabled,
}) {
  return (
    <BottomContainer
      topButton={
        <SolidButton
          text="Add Experiences"
          backgroundColor={isAddDisabled ? "#d4d4d4" : "#5FAF46"}
          textColor={"#ffffff"}
          onPress={onAdd}
          disabled={isAddDisabled} // Disable button if no experiences are selected
        />
      }
      bottomButton={
        <OutlinedButton
          borderColor={"#d4d4d4"}
          text={"Deselect All"}
          textColor={"#000000"}
          onPress={onDeselect}
        />
      }
    />
  );
}
