import React, { useRef } from "react";
import GoogleMapReact from "google-map-react";
import { Marker } from "./marker";
import styles from "./map.module.css";
import { useApartments } from "../../state/apartments/useApartments";
import { Apartment, UserRoles } from "../../types";
import { withAuthUser, useAuthUser } from 'next-firebase-auth'

const Map: React.FC<{ initialApartments: Apartment[] }> = ({
  initialApartments,
}) => {
  const AuthUser = useAuthUser()
  const map = useRef<google.maps.Map>(null);
  const mapsApi = useRef<any>(null);
  const apartments = useApartments(initialApartments);
  console.log(AuthUser.claims.role === UserRoles.ClIENT);
  

  return (
    <div className={styles.mapRoot}>
      <GoogleMapReact
        defaultZoom={10}
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
          libraries: ["places", "geometry"],
        }}
        defaultCenter={{ lat: 40.015, lng: -105.2705 }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={(gmaps) => {
          mapsApi.current = gmaps.maps;
          map.current = gmaps.map;
        }}
      >
        {apartments &&
          apartments.map((apartment) => {
            const latLngStr = apartment.latLng.split(",", 2);

            return (
              <Marker
                lat={parseFloat(latLngStr[0])}
                lng={parseFloat(latLngStr[1])}
                apartment={apartment}
              />
            );
          })}
      </GoogleMapReact>
    </div>
  );
};

export default withAuthUser<{ initialApartments: Apartment[]}>()(Map);
