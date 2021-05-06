import React, { useContext } from "react";
import { Apartment } from "../../types";
import styles from './map.module.css'

interface MarkerProps {
  lat: number;
  lng: number;
  apartment: Apartment
}

export const Marker = ({ apartment }: MarkerProps) => {
  return (
  <div className={styles.marker}>
    { apartment.pricePerMonth}
  </div>
  )
};
