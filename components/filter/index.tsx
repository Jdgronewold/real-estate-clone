import React, { useState } from 'react'
import styles from '../apartments/apartments.module.css'

interface FilterValues {
  min: number
  max: number
}

interface ApartmentFilterProps {
  price: FilterValues
  numRooms: FilterValues
  floorSize: FilterValues
  setPrice: (val: FilterValues) => void
  setNumRooms: (val: FilterValues) => void
  setFloorSize: (val: FilterValues) => void
}

export const ApartmentFilter: React.FC<ApartmentFilterProps> = ({
  price,
  numRooms,
  floorSize,
  setPrice,
  setNumRooms,
  setFloorSize
}) => {

  const [showFilters, setShowFilters] = useState(false)
  return (
    <div
    className={styles.apartmentFilters}
    style={{ height: showFilters ? 200 : 40 }}
  >
    <div className={styles.apartmentFilterHeader}>
      <div></div>
      <div>Filters</div>
      <div onClick={() => setShowFilters(!showFilters)} data-cy="toggle-filter">
        {showFilters ? "-" : "+"}
      </div>
    </div>
    <div
      className={styles.apartmentFilterOpacity}
      style={{ opacity: showFilters ? 1 : 0 }}
    >
      <div className={styles.apartmentFilter}>
        <input
          name="minPrice"
          value={price.min}
          placeholder="Min Price"
          type="number"
          onChange={({ target: { value } }) =>
            setPrice({ ...price, min: value ? parseInt(value) : null })
          }
        />
        <input
          name="maxPrice"
          value={price.max}
          placeholder="Max Price"
          type="number"
          onChange={({ target: { value } }) =>
            setPrice({ ...price, max: value ? parseInt(value) : null })
          }
        />
      </div>
      <div className={styles.apartmentFilter}>
        <input
          name="minFloorSize"
          value={floorSize.min}
          placeholder="Min Floor Size (Sq Ft)"
          type="number"
          onChange={({ target: { value } }) =>
            setFloorSize({
              ...floorSize,
              min: value ? parseInt(value) : null,
            })
          }
        />
        <input
          name="maxFloorSize"
          value={floorSize.max}
          placeholder="Max Floor Size (Sq Ft)"
          type="number"
          onChange={({ target: { value } }) =>
            setFloorSize({
              ...floorSize,
              max: value ? parseInt(value) : null,
            })
          }
        />
      </div>
      <div className={styles.apartmentFilter}>
        <input
          name="minNumRooms"
          value={numRooms.min}
          placeholder="Min Number of Rooms"
          type="number"
          onChange={({ target: { value } }) =>
            setNumRooms({
              ...numRooms,
              min: value ? parseInt(value) : null,
            })
          }
        />
        <input
          name="maxNumRooms"
          value={numRooms.max}
          type="number"
          placeholder="Max Number of Rooms"
          onChange={({ target: { value } }) =>
            setNumRooms({
              ...numRooms,
              max: value ? parseInt(value) : null,
            })
          }
        />
      </div>
    </div>
  </div>
  )
}