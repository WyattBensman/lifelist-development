import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

const BottomPopup = ({ visible, children, onRequestClose, height }) => {
  const [showModal, setShowModal] = useState(visible);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible, height]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.timing(animatedHeight, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setShowModal(false));
    }
  };

  const modalHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  return (
    <Modal transparent visible={showModal} onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.modalContent, { height: modalHeight }]}>
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C1C1C",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: "hidden",
  },
});

export default BottomPopup;
