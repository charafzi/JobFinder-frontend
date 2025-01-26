import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useHasSavedLocation = () => {
  const adress = useSelector((state) => state.auth.entreprise);
  
  return useMemo(() => {
    if (!adress) return false;
    const { adress, city, longitude, latitude } = adress;
    return Boolean(adress && city && longitude && latitude);
  }, [
    adress?.adress, 
    adress?.city, 
    adress?.longitude, 
    adress?.latitude
  ]);
};