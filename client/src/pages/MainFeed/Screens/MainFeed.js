import { StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import GreenButton from "../../../components/Buttons/GreenButton";
import BlueButton from "../../../components/Buttons/BlueButton";
import RedButton from "../../../components/Buttons/RedButton";
import GreyButton from "../../../components/Buttons/GreyButton";
import BlueOutlineButton from "../../../components/Buttons/BlueOutlineButton";
import GreenOutlineButton from "../../../components/Buttons/GreenOutlineButton";
import GreyOutlineButton from "../../../components/Buttons/GreyOutlineButton";
import RedOutlineButton from "../../../components/Buttons/RedOutlineButton";

export default function MainFeed() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.center}>
        <GreenButton width={250} text={"Hey"} />
        <BlueButton width={250} text={"Hey"} />
        <RedButton width={250} text={"Hey"} />
        <GreyButton width={250} text={"Hey"} />
        <BlueOutlineButton width={250} text={"Hey"} />
        <GreenOutlineButton width={250} text={"Hey"} />
        <GreyOutlineButton width={250} text={"Hey"} />
        <RedOutlineButton width={250} text={"Hey"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
  },
});
