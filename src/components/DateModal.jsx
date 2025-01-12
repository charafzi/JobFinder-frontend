import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import DateTimePicker from "react-native-ui-datepicker";
import { Color } from "../constants/Color";

const DateModal = ({
  handleCloseModal,
  showDatePicker,
  handleSetDate,
  date,
  control,
}) => {
  return (
    <Modal
      visible={showDatePicker}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.dateModalContainer}>
        <View style={styles.dateModalContent}>
          <Controller
            control={control}
            name="dateLimite"
            render={({ field: { onChange, value } }) => (
              <View>
                <DateTimePicker
                  mode="single"
                  date={date}
                  value={value ? new Date(value) : date.toDate()}
                  onChange={(params) => {
                    console.log("Selected Date:", params.date);
                    handleSetDate(params.date);
                    onChange(params.date);
                    // handleCloseModal();
                  }}
                  minimumDate={new Date()}
                  disabledDates={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  selectedItemColor={Color.link}
                  timePicker
                  timePickerDecelerationRate={"normal"}
                />
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={styles.modalText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DateModal;

const styles = StyleSheet.create({
  dateModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dateModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    color: Color.link,
    fontWeight: "bold",
  },
  modalSubmit: {
    padding: 15,
    marginTop: 10,
  },
});
