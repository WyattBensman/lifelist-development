import { View } from "react-native";
import UserCard from "../../Cards/UserCard";
import { layoutStyles } from "../../../../styles";

export default function Followers() {
  return (
    <View style={layoutStyles.containerTab}>
      <UserCard />
    </View>
  );
}
