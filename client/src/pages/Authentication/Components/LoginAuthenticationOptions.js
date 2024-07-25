import { Image, View } from "react-native";
import { layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function LoginAuthenticationOptions({ onLoginOption }) {
  return (
    <View style={layoutStyles.container}>
      <ButtonSolid
        text={"Phone Number or Email"}
        textColor={"#ffffff"}
        backgroundColor={"#1c1c1c"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/PhoneEmailIcon.png")}
            style={{ height: 17.5, width: 17.5, marginRight: 2 }}
          />
        }
        onPress={onLoginOption}
      />
      <SolidButton
        text={"Continue with Gmail"}
        textColor={"#ffffff"}
        backgroundColor={"#1c1c1c"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/GmailIcon.png")}
            style={{ height: 17.5, width: 17.5, marginRight: 2 }}
          />
        }
      />
      <SolidButton
        text={"Continue with Facebook"}
        textColor={"#ffffff"}
        backgroundColor={"#1c1c1c"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/FacebookIcon.png")}
            style={{ height: 17.5, width: 17.5, marginRight: 2 }}
          />
        }
      />
    </View>
  );
}
