import { View, Text, StyleSheet, Pressable } from "react-native";

const tabs = [{ name: "All" }, { name: "Users" }, { name: "Communities" }];

export default function ExploreNavigator({ activeTab, setActiveTab }) {
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.navigatorWrapper}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          style={[
            styles.navigatorButton,
            activeTab === tab.name && styles.activeNavigatorButton,
          ]}
          onPress={() => handleTabPress(tab.name)}
        >
          <Text
            style={[
              styles.navigatorText,
              activeTab === tab.name && styles.activeNavigatorText,
            ]}
          >
            {tab.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navigatorWrapper: {
    flexDirection: "row",
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1C",
  },
  navigatorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // spacing between buttons
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  navigatorText: {
    color: "#d4d4d4",
    fontWeight: "500",
  },
  activeNavigatorText: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
