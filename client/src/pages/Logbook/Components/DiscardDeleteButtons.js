import SolidButton from "../../../components/SolidButton";
import OutlinedButton from "../../../components/OutlinedButton";
import BottomContainer from "../../../components/BottomContainer";

export default function DiscardDeleteButtons({ toggleEditMode }) {
  return (
    <BottomContainer
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
