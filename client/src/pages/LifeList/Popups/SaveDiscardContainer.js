import BottomContainer from "../../../components/BottomContainer";
import OutlinedButton from "../../../components/OutlinedButton";
import SolidButton from "../../../components/SolidButton";

export default function SaveDiscardContainer({ toggleEditMode }) {
  return (
    <BottomContainer
      topButton={
        <SolidButton
          text="Save Changes"
          backgroundColor={"#5FAF46"}
          textColor={"#ffffff"}
        />
      }
      bottomButton={
        <OutlinedButton
          borderColor={"#d4d4d4"}
          text={"Discard"}
          textColor={"#000000"}
          onPress={toggleEditMode}
        />
      }
    />
  );
}
