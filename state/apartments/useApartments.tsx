import { useState, useEffect } from "react";
import { Apartment, UserRoles } from "../../types";
import app from "firebase/app";
import { parseApartments } from "../../utils/parseApartments";
import { useAuthUser } from "next-firebase-auth";

export const useApartments = (initialApartments: Apartment[]) => {
  const [apartments, setApartments] = useState(initialApartments);
  const AuthUser = useAuthUser()
  

  useEffect(() => {
    const ref = app.database().ref("/apartments");

    ref.on("value", (snapshot) => {
      const apartmentsObject = snapshot.val();
      console.log(apartmentsObject);
      
      if (apartmentsObject) {
        const fetchedApartments = parseApartments(apartmentsObject, AuthUser.claims.role === UserRoles.ClIENT);
        setApartments(fetchedApartments);
      }
    });
  }, []);

  return apartments;
};
