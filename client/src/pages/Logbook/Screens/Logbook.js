import { StyleSheet, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import EditButtonIcon from "../../../icons/Logbook/EditButtonIcon";
import UpcomingExperienceIcon from "../../../icons/Logbook/UpcomingExperienceIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";

export default function Logbook() {
  return (
    <View style={styles.container}>
      <StackHeader title="Logbook" button1={<EditButtonIcon />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
