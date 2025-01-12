import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { MainNavigator } from "./src/navigator";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
  );
}
