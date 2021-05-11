import React, { useContext } from "react";
import { Apartment } from "../../types";
import styles from './map.module.css'
import Link from 'next/link'

interface MarkerProps {
  lat: number;
  lng: number;
  apartment: Apartment
}

export const Marker = ({ apartment }: MarkerProps) => {
  return (
    <Link href={`/apartments/${apartment.uid}`}>
      <div className={styles.marker} data-cy={`marker-${apartment.name}`}>
        { apartment.pricePerMonth}
      </div>
    </Link>
  
  )
};
