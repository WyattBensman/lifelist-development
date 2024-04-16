import { Image, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";

export default function LoginAuthenticationOptions({ onLoginOption }) {
  return (
    <View style={layoutStyles.container}>
      <SolidButton
        text={"Phone Number or Email"}
        backgroundColor={"#ececec"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/PhoneEmailIcon.png")}
            style={{ height: 17.5, width: 17.5 }}
          />
        }
        onPress={onLoginOption}
      />
      <SolidButton
        text={"Continue with Gmail"}
        backgroundColor={"#ececec"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/GmailIcon.png")}
            style={{ height: 17.5, width: 17.5 }}
          />
        }
      />
      <SolidButton
        text={"Continue with Facebook"}
        backgroundColor={"#ececec"}
        marginTop={12}
        icon={
          <Image
            source={require("../Icons/FacebookIcon.png")}
            style={{ height: 17.5, width: 17.5 }}
          />
        }
      />
    </View>
  );
}
