import React from 'react'
import { Apartment } from '../../types'
import styles from './apartments.module.css'
import { useRouter } from 'next/router'

export const ApartmentCard = ({ apartment}: { apartment: Apartment}) => { 
  const router = useRouter()

  const navigateToApartment = (uid: string) => {
    router.push(`/apartments/${uid}`)
  }

  return (
    <li className={styles.apartmentCard} onClick={() => navigateToApartment(apartment.uid)}>
      <div className={styles.apartmentCardHeader}>
        <div>{apartment.name}</div>
        <div>{`$${apartment.pricePerMonth}`}</div>
        </div>
      <div>
        <span>{apartment.numRooms} Rooms</span>
        <span>{apartment.floorSize} Sq. Ft.</span>
      </div>
      <div><span>{apartment.address}</span></div>
      <div className={styles.apartmentCardFooter}>
        <span>{apartment.realtor}</span>
      </div>
    </li>
  )
}