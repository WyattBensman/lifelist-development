import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

const BottomPopup = ({
  visible,
  children,
  onRequestClose,
  initialHeight,
  draggableHeader,
  closeThreshold = 150, // New prop for swipe distance threshold
  autoCloseVelocity = 1.5, // New prop for velocity threshold
}) => {
  const [showModal, setShowModal] = useState(visible);
  const animatedHeight = useRef(new Animated.Value(initialHeight)).current;
  const lastGestureDy = useRef(0);
  const lastGestureVelocity = useRef(0); // To track gesture velocity
  const TOP_PADDING = 57.5;
  const currentHeight = useRef(initialHeight);

  useEffect(() => {
    toggleModal();
  }, [visible, initialHeight]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      currentHeight.current = animatedHeight._value; // Capture the current height when the drag starts
    },
    onPanResponderMove: (event, gestureState) => {
      let newHeight = currentHeight.current - gestureState.dy;
      if (newHeight >= TOP_PADDING && newHeight <= screenHeight - TOP_PADDING) {
        animatedHeight.setValue(newHeight);
      }
      lastGestureDy.current = gestureState.dy;
      lastGestureVelocity.current = gestureState.vy; // Capture gesture velocity
    },
    onPanResponderRelease: () => {
      // Auto-close if dragging down quickly (velocity exceeds autoCloseVelocity)
      if (lastGestureVelocity.current > autoCloseVelocity) {
        onRequestClose();
        return;
      }

      // Close or expand based on drag distance (lastGestureDy)
      if (lastGestureDy.current > closeThreshold) {
        onRequestClose();
      } else if (lastGestureDy.current < -closeThreshold) {
        expandModal();
      } else {
        resetModalHeight();
      }
    },
  });

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.timing(animatedHeight, {
        toValue: initialHeight,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: TOP_PADDING,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setShowModal(false));
    }
  };

  const expandModal = () => {
    Animated.timing(animatedHeight, {
      toValue: screenHeight - TOP_PADDING,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const resetModalHeight = () => {
    Animated.timing(animatedHeight, {
      toValue: initialHeight,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Modal transparent visible={showModal} onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.modalContent, { height: animatedHeight }]}>
        {/* Draggable Header */}
        <View {...panResponder.panHandlers}>{draggableHeader}</View>

        {/* Non-draggable content */}
        <View style={styles.nonDraggableContent}>{children}</View>
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
  nonDraggableContent: {
    flex: 1,
  },
});

export default BottomPopup;
