import { Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import AuthenticationNavigator from "../Navigators/AuthenticationNavigator";
import { useState } from "react";

export default function Authentication() {
  const [activeTab, setActiveTab] = useState("Messages");

  return (
    <View style={[layoutStyles.container, { paddingTop: 51.5 }]}>
      <AuthenticationNavigator onTabChange={setActiveTab} />
      <Text style={authenticationStyles.smallText}>
        By continuing, you agree to LifeList’s{" "}
        <Text style={{ fontStyle: "italic" }}>Terms of Service </Text>and
        confirm that you have read LifeList’s{" "}
        <Text style={{ fontStyle: "italic" }}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}
