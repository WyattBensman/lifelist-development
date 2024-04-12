import { View } from "react-native";
import { layoutStyles } from "../../../../styles";
import UserCard from "../../Cards/UserCard";

export default function Following() {
  return (
    <View style={layoutStyles.containerTab}>
      <UserCard />
    </View>
  );
}
