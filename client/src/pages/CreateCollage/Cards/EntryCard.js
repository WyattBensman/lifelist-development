import { Pressable, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { useState } from "react";

export default function StartEntryForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const textContent =
    "Morning surf lessons turned laughter-filled adventures, followed by a feast of local delights under the shade of swaying palms. Hahahaha this is kind of cool I guess. Morning surf lessons turned laughter-filled adventures, followed by a feast of local delights under the shade of swaying palms. Hahahaha this is kind of cool I guess";
  const truncateLength = 138;
  const shouldTruncate = textContent.length > truncateLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? textContent.substring(0, truncateLength) + "..."
      : textContent;

  return (
    <View style={[layoutStyles.wrapper, layoutStyles.marginTopMd]}>
      <View style={cardStyles.entryCardContainer}>
        <Text style={{ fontWeight: "500" }}>This is the Title</Text>
        <Text style={layoutStyles.marginTopXxs}>{displayText}</Text>
        {shouldTruncate && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={cardStyles.readMore}>
              {isExpanded ? "Read Less" : "Read More"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
