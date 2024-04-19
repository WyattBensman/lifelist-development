import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { createRef, useState } from "react";
import SolidButton from "../../../components/SolidButton";
import HeaderStack from "../../../components/Headers/HeaderStack";

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
    <View style={layoutStyles.wrapper}>
      <HeaderStack arrow={<BackArrowIcon navigation={navigation} />} />
      <View
        style={[
          authenticationStyles.container,
          { justifyContent: "flex-start" },
        ]}
      >
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={authenticationStyles.iconLarge}
          resizeMode="contain"
        />
        <Text style={authenticationStyles.header}>Verify Account</Text>
        <Text style={styles.smallText}>
          We sent you a 5-digit code to wyatt@gmail.com. Enter the code below to
          confirm your phone number.
        </Text>
        <View style={authenticationStyles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputs[index]}
              style={authenticationStyles.codeInput}
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
  smallText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
});
