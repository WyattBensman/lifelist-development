import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CustomDatePicker() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  ); // Last 100 years

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={month}
          onValueChange={(value) => setMonth(value)}
          style={styles.picker}
        >
          <Picker.Item label="Month" value="" />
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={month} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={day}
          onValueChange={(value) => setDay(value)}
          style={styles.picker}
        >
          <Picker.Item label="Day" value="" />
          {days.map((day) => (
            <Picker.Item key={day} label={day.toString()} value={day} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={year}
          onValueChange={(value) => setYear(value)}
          style={styles.picker}
        >
          <Picker.Item label="Year" value="" />
          {years.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>

      <Text style={styles.selectedText}>
        Selected Date: {month} {day}, {year || ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pickerWrapper: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
  },
});
