import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import { BASE_URL } from "../../../utils/config";

export default function UserRelationsCard({ user, action }) {
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;

  return (
    <View style={cardStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image source={{ uri: profilePictureUrl }} style={cardStyles.imageMd} />
        <View>
          <Text style={cardStyles.primaryText}>{user.fullName}</Text>
          <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
            @{user.username}
          </Text>
        </View>
      </View>
      <View style={layoutStyles.marginRightMd}>
        <ButtonSmall text={action} backgroundColor={"#ececec"} />
      </View>
    </View>
  );
}
