import SolidButton from "../../../components/SolidButton";
import BottomButtonContainer from "../../../components/Containers/BottomButtonContainer";

export default function StartAddContainer({ toggleModal }) {
  return (
    <BottomButtonContainer
      topButton={
        <SolidButton
          text="Start New Experience"
          backgroundColor={"#6AB952"}
          textColor={"#ffffff"}
        />
      }
      bottomButton={
        <SolidButton
          text="Add Upcoming Experience"
          backgroundColor={"#5FC4ED"}
          textColor={"#ffffff"}
          onPress={toggleModal}
        />
      }
    />
  );
}
