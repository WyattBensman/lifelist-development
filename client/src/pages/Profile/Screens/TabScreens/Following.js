import { ScrollView } from "react-native";
import { layoutStyles } from "../../../../styles";
import UserRelationsCard from "../../Cards/UserRelationsCard";

export default function Following() {
  return (
    <ScrollView style={[layoutStyles.wrapper, layoutStyles.paddingTopXs]}>
      <UserRelationsCard />
    </ScrollView>
  );
}
