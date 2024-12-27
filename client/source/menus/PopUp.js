import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  View,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

const PopUp = ({
  visible,
  children,
  onRequestClose,
  initialHeight,
  draggableHeader,
  closeThreshold = 150,
  autoCloseVelocity = 1.5,
}) => {
  const [showModal, setShowModal] = useState(visible);
  const animatedHeight = useRef(new Animated.Value(initialHeight)).current;
  const lastGestureDy = useRef(0);
  const lastGestureVelocity = useRef(0);
  const TOP_PADDING = 57.5;
  const currentHeight = useRef(initialHeight);

  useEffect(() => {
    toggleModal();
  }, [visible, initialHeight]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      currentHeight.current = animatedHeight._value;
    },
    onPanResponderMove: (event, gestureState) => {
      let newHeight = currentHeight.current - gestureState.dy;
      if (newHeight >= TOP_PADDING && newHeight <= screenHeight - TOP_PADDING) {
        animatedHeight.setValue(newHeight);
      }
      lastGestureDy.current = gestureState.dy;
      lastGestureVelocity.current = gestureState.vy;
    },
    onPanResponderRelease: () => {
      if (lastGestureVelocity.current > autoCloseVelocity) {
        onRequestClose();
        return;
      }

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
        <View style={menuStyles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[menuStyles.modalContent, { height: animatedHeight }]}
      >
        <View {...panResponder.panHandlers}>{draggableHeader}</View>
        <View style={menuStyles.nonDraggableContent}>{children}</View>
      </Animated.View>
    </Modal>
  );
};

export default BottomPopup;
