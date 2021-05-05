import React from 'react'
import { Apartment } from '../../types'
import styles from './apartments.module.css'
import { ApartmentCard } from './apartmentCard'

const ApartmentList: React.FC<{ apartments: Apartment[] }> = ({apartments}) => {
  
  return (
    <ul className={styles.apartmentList}>
      {
        apartments.map((apartment) => {
          return <ApartmentCard apartment={apartment} key={new Date(apartment.dateAdded).getTime()}/>
        })
      }
    </ul>
  )
}

export default ApartmentList