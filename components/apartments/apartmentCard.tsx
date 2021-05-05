import React from 'react'
import { Apartment } from '../../types'
import styles from './apartments.module.css'

export const ApartmentCard = ({ apartment}: { apartment: Apartment}) => { 
  return (
    <li className={styles.apartmentCard}>
      <div className={styles.apartmentCardHeader}>
        <div>{apartment.name}</div>
        <div>{`$${apartment.pricePerMonth}`}</div>
        </div>
      <div>
        <span>{apartment.numRooms} Rooms</span>
        <span>{apartment.floorSize} Sq. Ft.</span>
      </div>
      <div><span>Address Here</span></div>
      <div className={styles.apartmentCardFooter}>
        <span>{apartment.realtor}</span>
      </div>
    </li>
  )
}