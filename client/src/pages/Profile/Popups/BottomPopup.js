import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";

const BottomPopup = ({ visible, children, onRequestClose, height }) => {
  const [showModal, setShowModal] = useState(visible);
  const animatedHeight = useRef(new Animated.Value(height)).current;
  const lastGestureDy = useRef(0);
  const currentHeight = useRef(height);
  const TOP_PADDING = 57.5;

  useEffect(() => {
    toggleModal();
  }, [visible, height]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      currentHeight.current = animatedHeight._value; // Capture the current height when the drag starts
    },
    onPanResponderMove: (event, gestureState) => {
      let newHeight = currentHeight.current - gestureState.dy;
      if (newHeight >= TOP_PADDING && newHeight <= height) {
        animatedHeight.setValue(newHeight);
      }
      lastGestureDy.current = gestureState.dy;
    },
    onPanResponderRelease: () => {
      if (lastGestureDy.current > 50) {
        onRequestClose();
      } else {
        resetModalHeight();
      }
    },
  });

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.timing(animatedHeight, {
        toValue: height,
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

  const resetModalHeight = () => {
    Animated.timing(animatedHeight, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Modal transparent visible={showModal} onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.modalContent, { height: animatedHeight }]}
        {...panResponder.panHandlers}
      >
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
