import { Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import CollageNavigator from "../Navigators/CollageNavigator";
import CollagePanel from "../PanelComponents/CollagePanel";
import { useState } from "react";

export default function Collage() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <View style={layoutStyles.wrapper}>
      <CollageNavigator />
      <CollagePanel isAdmin={isAdmin} />
    </View>
  );
}
