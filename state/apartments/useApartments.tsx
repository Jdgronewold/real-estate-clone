import { useState, useEffect } from 'react';
import { Apartment } from "../../types";
import app from "firebase/app";
import { parseApartments } from '../../utils/parseApartments';

export const useApartments = (initialApartments: Apartment[]) => {
  const [apartments, setApartments] = useState(initialApartments);
 
  useEffect(() => {
    app
      .database()
      .ref("/apartments")
      .on("value", (snapshot) => {
        
        const apartmentsObject = snapshot.val();
        if (apartmentsObject) {
          const fetchedApartments = parseApartments(apartmentsObject)
          setApartments(fetchedApartments);
        }
      });
  }, []);

  return apartments;
};
