import BottomContainer from "../../../components/Containers/BottomContainer";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import ButtonOutline from "../../../components/Buttons/ButtonOutline";

export default function EditProfileBottomContainer({
  saveChanges,
  discardChanges,
}) {
  return (
    <BottomContainer
      topButton={
        <ButtonSolid
          text="Save Changes"
          backgroundColor={"#6AB95230"}
          borderColor={"#6AB95250"}
          textColor={"#6AB952"}
          onPress={saveChanges}
        />
      }
      bottomButton={
        <ButtonOutline
          borderColor={"#1C1C1C"}
          text={"Discard"}
          textColor={"#d4d4d4"}
          onPress={discardChanges}
        />
      }
    />
  );
}
