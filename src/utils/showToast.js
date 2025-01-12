import Toast from "react-native-toast-message";

export const showToast = (type, text1, text2 = "") => {
  Toast.show({
    type: type.toLowerCase(),
    text1,
    text2,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 40,
  });
};
