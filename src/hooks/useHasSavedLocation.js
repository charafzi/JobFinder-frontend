import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useHasSavedLocation = () => {
  const entreprise = useSelector((state) => state.auth.entreprise);
  
  return useMemo(() => {
    if (!entreprise?.adress) return false;
    const { adress, city, longitude, latitude } = entreprise.adress;
    return Boolean(adress && city && longitude && latitude);
  }, [
    entreprise?.adress?.adress, 
    entreprise?.adress?.city, 
    entreprise?.adress?.longitude, 
    entreprise?.adress?.latitude
  ]);
};