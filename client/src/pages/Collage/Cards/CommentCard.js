import { Image, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";

export default function CommentCard() {
  return (
    <View style={layoutStyles.flex}>
      <View style={layoutStyles.flexRow}>
        <Image style={[styles.imageContainer, { marginRight: 8 }]} />
        <View style={styles.commentContainer}>
          <View style={[layoutStyles.flexRow, { marginBottom: 4 }]}>
            <Text style={[styles.username, { marginRight: 8 }]}>
              Caleb Kauffman
            </Text>
            <Text style={styles.postTime}>2h</Text>
          </View>
          <Text style={styles.commentText}>
            Okay so this is the actual comment right here cuzzo how do I get
            this shit
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 35,
    width: 35,
    backgroundColor: "#d4d4d4",
  },
  username: {
    fontWeight: "500",
  },
  postTime: {
    color: "#d4d4d4",
  },
  commentContainer: {
    flex: 1, // Ensure that the container takes up the remaining space beside the image
  },
  commentText: {
    marginRight: 8, // Keep some margin on the right for spacing
    flexShrink: 1, // Allow text to shrink and wrap within the available space
  },
});
