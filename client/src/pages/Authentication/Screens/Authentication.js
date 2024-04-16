import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import AuthenticationNavigator from "../Navigators/AuthenticationNavigator";
import { useState } from "react";

export default function Authentication() {
  const [activeTab, setActiveTab] = useState("Messages");

  return (
    <View style={[layoutStyles.container, { paddingTop: 51.5 }]}>
      <AuthenticationNavigator onTabChange={setActiveTab} />
    </View>
  );
}
