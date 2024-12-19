import React, { useState } from "react";
import { View, FlatList, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../styles";
import HeaderStack from "../../components/Headers/HeaderStack";
import Icon from "../../components/Icons/Icon";
import ReportCard from "./ReportCard";
import DangerAlert from "../../components/Alerts/DangerAlert";

// Import entity-specific mutations
import {
  REPORT_COLLAGE,
  REPORT_COMMENT,
  REPORT_MOMENT,
  REPORT_PROFILE,
} from "../../utils/mutations";

// Expanded report reasons for all entities
const reportReasons = [
  { label: "Inappropriate Content", value: "INAPPROPRIATE_CONTENT" },
  { label: "Copyright Violation", value: "COPYRIGHT_VIOLATION" },
  { label: "Harassment or Bullying", value: "HARASSMENT_OR_BULLYING" },
  {
    label: "False Information or Misrepresentation",
    value: "FALSE_INFORMATION_OR_MISREPRESENTATION",
  },
  {
    label: "Violates Community Guidelines",
    value: "VIOLATES_COMMUNITY_GUIDELINES",
  },
  { label: "Spam or Scams", value: "SPAM_OR_SCAMS" },
  { label: "Nudity or Sexual Content", value: "NUDITY_OR_SEXUAL_CONTENT" },
  {
    label: "Hate Speech or Discrimination",
    value: "HATE_SPEECH_OR_DISCRIMINATION",
  },
  { label: "Impersonation", value: "IMPERSONATION" },
  { label: "Unsolicited Contact", value: "UNSOLICITED_CONTACT" },
  { label: "Underage Account", value: "UNDERAGE_ACCOUNT" },
  { label: "Unauthorized Activity", value: "UNAUTHORIZED_ACTIVITY" },
  { label: "Other", value: "OTHER" },
];

export default function Report({ route }) {
  const navigation = useNavigation();
  const { entityId, entityType } = route.params; // Entity ID and Type passed via navigation
  const [selectedReason, setSelectedReason] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Define mutations for each entity type
  const [reportCollage] = useMutation(REPORT_COLLAGE);
  const [reportComment] = useMutation(REPORT_COMMENT);
  const [reportMoment] = useMutation(REPORT_MOMENT);
  const [reportProfile] = useMutation(REPORT_PROFILE);

  // Handle reason selection
  const handleReportPress = (reason) => {
    setSelectedReason(reason);
  };

  // Handle submit button press
  const handleSubmit = () => {
    if (selectedReason) {
      setModalVisible(true);
    }
  };

  // Confirm and submit the report
  const handleConfirm = async () => {
    try {
      if (!entityId || !entityType) {
        throw new Error("Invalid entity details.");
      }

      // Dynamically select the proper mutation based on the entity type
      switch (entityType) {
        case "COLLAGE":
          await reportCollage({
            variables: { collageId: entityId, reason: selectedReason },
          });
          break;
        case "COMMENT":
          await reportComment({
            variables: { commentId: entityId, reason: selectedReason },
          });
          break;
        case "MOMENT":
          await reportMoment({
            variables: { momentId: entityId, reason: selectedReason },
          });
          break;
        case "PROFILE":
          await reportProfile({
            variables: { profileId: entityId, reason: selectedReason },
          });
          break;
        default:
          throw new Error("Unsupported entity type.");
      }

      // Close modal and navigate back
      setModalVisible(false);
      navigation.popToTop();
    } catch (error) {
      console.error("Error reporting:", error.message);
      setModalVisible(false);
    }
  };

  // Render each report reason
  const renderItem = ({ item }) => (
    <ReportCard
      label={item.label}
      selected={selectedReason === item.value}
      onSelect={() => handleReportPress(item.value)}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="Report"
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={handleSubmit} disabled={!selectedReason}>
            <Text
              style={[
                styles.createButtonText,
                selectedReason && styles.createButtonTextActive,
              ]}
            >
              Submit
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={reportReasons}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
      />
      <DangerAlert
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title="Confirm Report"
        message={`Are you sure you want to report this ${entityType.toLowerCase()}?`}
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
        confirmButtonText="Report"
        cancelButtonText="Cancel"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createButtonText: {
    fontSize: 12,
    color: "#696969",
    fontWeight: "600",
  },
  createButtonTextActive: {
    color: "#6AB952",
    fontWeight: "600",
  },
});
