import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EntryCard() {
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
    <View style={styles.container}>
      <Text style={styles.title}>This is the Title</Text>
      <Text style={styles.spacer}>{displayText}</Text>
      {shouldTruncate && (
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.readMore}>
            {isExpanded ? "Read Less" : "Read More"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d4d4d4",
  },
  title: {
    fontWeight: "500",
  },
  readMore: {
    marginTop: 8,
    fontSize: 12,
    color: "#6AB952",
    textAlign: "center",
  },
  spacer: {
    marginTop: 6,
  },
});
