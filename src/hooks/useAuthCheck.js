import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';

export const useAuthCheck = () => {
  const { isLoggedIn, isCandidat } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Current isLoggedIn state:', isLoggedIn);
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to login");
      // Use CommonActions to ensure proper navigation reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'login' }],
        })
      );
    } else {
      // Optional: You can handle different user type redirects here
      console.log("User is logged in, user type:", isCandidat ? "Candidat" : "Entreprise");
    }
  }, [isLoggedIn, navigation, isCandidat]);

  return isLoggedIn;
};
