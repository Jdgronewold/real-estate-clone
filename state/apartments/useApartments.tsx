import { useState, useEffect } from 'react';
import { Apartment } from "../../types";
import app from "firebase/app";

export const useApartments = (initialApartments: Apartment[]) => {
  const [apartments, setApartments] = useState(initialApartments);
 
  useEffect(() => {
    app
      .database()
      .ref("/apartments")
      .on("value", (snapshot) => {
        
        const apartmentsObject = snapshot.val();
        if (apartmentsObject) {
          const fetchedApartments = Object.keys(apartmentsObject).map(
            (aptKey) => apartmentsObject[aptKey]
          );
          setApartments(fetchedApartments);
        }
      });
  }, []);

  return apartments;
};
