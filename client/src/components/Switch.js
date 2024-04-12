import { Switch, StyleSheet } from "react-native";

export default function GlobalSwitch({ isOn, onToggle }) {
  return (
    <Switch
      trackColor={{ false: "#767577", true: "#6AB952" }}
      thumbColor={"#ffffff"}
      ios_backgroundColor="#d4d4d4"
      onValueChange={onToggle}
      value={isOn}
      style={styles.switch}
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
});
