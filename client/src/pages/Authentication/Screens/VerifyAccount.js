import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { createRef, useState } from "react";
import SolidButton from "../../../components/SolidButton";

export default function VerifyAccount() {
  const navigation = useNavigation();
  const codeLength = 5;
  const inputs = Array(codeLength)
    .fill(0)
    .map(() => createRef());

  const [code, setCode] = useState(Array(codeLength).fill(""));

  const handleCodeInput = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputs[index + 1].current.focus();
    }
  };

  return (
    <View style={layoutStyles.container}>
      <StackHeader arrow={<BackArrowIcon navigation={navigation} />} />
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={{ width: 80, height: 80, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Text style={styles.header}>Verify Account</Text>
        <Text style={styles.smallText}>
          We sent you a 5-digit code to wyatt@gmail.com. Enter the code below to
          confirm your phone number.
        </Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputs[index]}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeInput(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="done"
              textContentType="oneTimeCode"
            />
          ))}
        </View>
        <SolidButton
          text={"Verify Email"}
          backgroundColor={"#ececec"}
          onPress={() => navigation.navigate("SetLoginInformation")}
        />
        <Text style={styles.smallText}>Didn’t receive our code?</Text>
        <Text style={[styles.smallText, { marginTop: 6, color: "#6AB952" }]}>
          Resend Verification
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginTop: 48,
    margin: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  subheader: {
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
    color: "#6AB952",
    marginBottom: 16,
    marginTop: 6,
  },
  smallText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 32,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
    textAlign: "center",
    fontSize: 16,
  },
});
