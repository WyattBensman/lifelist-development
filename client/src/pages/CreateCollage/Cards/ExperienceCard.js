import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";
import PinIcon from "../../Explore/Icons/PinIcon";

export default function ExperienceCard() {
  const experienceTitle = "Jackson Hole";
  const truncatedTitle = truncateText(experienceTitle, 16);
  const experienceDescription = "Wyoming";
  const truncatedDescription = truncateText(experienceDescription, 16);

  return (
    <View style={cardStyles.experienceCardContainerMd}>
      <Image
        source={require("../../../../public/images/jackson-hole-01.png")}
        style={cardStyles.imageExperienceMd}
        resizeMode="cover"
      />
      <View style={cardStyles.leftSpacer}>
        <Text style={[cardStyles.primaryTextSm, layoutStyles.marginTopTy]}>
          {truncatedTitle}
        </Text>
        <View style={layoutStyles.flexRow}>
          <PinIcon />
          <Text style={[cardStyles.secondaryTextSm]}>
            {truncatedDescription}
          </Text>
        </View>
      </View>
    </View>
  );
}
