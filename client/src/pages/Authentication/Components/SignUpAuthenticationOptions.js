import { Image, View } from "react-native";
import { layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useNavigation } from "@react-navigation/native";

export default function SignUpAuthenticationOptions({ onSignUpOption }) {
  const navigation = useNavigation();

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
        onPress={onSignUpOption}
      />
      <SolidButton
        text={"Sign up with Gmail"}
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
        text={"Sign up with Facebook"}
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
