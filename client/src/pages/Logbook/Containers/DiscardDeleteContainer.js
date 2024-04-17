import SolidButton from "../../../components/SolidButton";
import OutlinedButton from "../../../components/OutlinedButton";
import BottomButtonContainer from "../../../components/Containers/BottomButtonContainer";

export default function DiscardDeleteContainer({ toggleEditMode }) {
  return (
    <BottomButtonContainer
      topButton={
        <SolidButton
          backgroundColor={"#DB302D"}
          text={"Delete Experiences"}
          textColor={"#FFFFFF"}
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
