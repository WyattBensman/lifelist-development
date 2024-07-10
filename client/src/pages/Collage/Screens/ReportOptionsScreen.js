import React, { useState } from "react";
import { View, FlatList, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import ReportOptionsCard from "../Cards/ReportOptionsCard"; // Ensure correct import path
import { REPORT_COLLAGE, REPORT_COMMENT } from "../../../utils/mutations"; // Ensure correct import path
import ConfirmReportModal from "../Popups/ConfirmReportModal";

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
];

export default function ReportOptionsScreen({ route }) {
  const navigation = useNavigation();
  const { collageId, commentId } = route.params;
  const [selectedReason, setSelectedReason] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [reportCollage] = useMutation(REPORT_COLLAGE);
  const [reportComment] = useMutation(REPORT_COMMENT);

  const handleReportPress = (reason) => {
    setSelectedReason(reason);
  };

  const handleSubmit = () => {
    if (selectedReason) {
      setModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    try {
      if (collageId) {
        await reportCollage({
          variables: { collageId, reason: selectedReason },
        });
      } else if (commentId) {
        await reportComment({
          variables: { commentId, reason: selectedReason },
        });
      }
      setModalVisible(false);
      navigation.popToTop(); // Navigate to the top of the stack
    } catch (error) {
      console.error("Error reporting:", error.message);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <ReportOptionsCard
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
      <ConfirmReportModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirm={handleConfirm}
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
