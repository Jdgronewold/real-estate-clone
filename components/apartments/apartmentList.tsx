import React, { useState, useMemo } from "react";
import { Apartment } from "../../types";
import styles from "./apartments.module.css";
import ApartmentCard from "./apartmentCard";

const ApartmentList: React.FC<{ apartments: Apartment[] }> = ({
  apartments,
}) => {
  const [floorSize, setFloorSize] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });
  const [numRooms, setNumRooms] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });
  const [price, setPrice] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredApartments = useMemo(() => {
    const apartmentsFilteredByPrice = apartments.filter((apt) => {
      let filtered = true;
      if (price.min !== null) {
        filtered = apt.pricePerMonth > price.min;
      }
      if (price.max !== null) {
        filtered = apt.pricePerMonth < price.max;
      }
      return filtered;
    });

    const apartmentsFilteredByRooms = apartmentsFilteredByPrice.filter(
      (apt) => {
        let filtered = true;

        if (numRooms.min !== null) {
          filtered = apt.numRooms > numRooms.min;
        }
        if (numRooms.max !== null) {
          filtered = apt.numRooms < numRooms.max;
        }
        return filtered;
      }
    );

    const apartmentsFilteredBySize = apartmentsFilteredByRooms.filter((apt) => {
      let filtered = true;
      if (floorSize.min !== null) {
        filtered = apt.floorSize > floorSize.min;
      }
      if (floorSize.max !== null) {
        filtered = apt.floorSize < floorSize.max;
      }
      return filtered;
    });
    return apartmentsFilteredBySize;
  }, [apartments, floorSize, price, numRooms]);

  return (
    <div className={styles.apartments}>
      <div
        className={styles.apartmentFilters}
        style={{ height: showFilters ? 200 : 40 }}
      >
        <div className={styles.apartmentFilterHeader}>
          <div></div>
          <div>Filters</div>
          <div onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "-" : "+"}
          </div>
        </div>
        <div
          className={styles.apartmentFilterOpacity}
          style={{ opacity: showFilters ? 1 : 0 }}
        >
          <div className={styles.apartmentFilter}>
            <input
              name="minPrince"
              value={price.min}
              placeholder="Min Price"
              type="number"
              onChange={({ target: { value } }) =>
                setPrice({ ...price, min: value ? parseInt(value) : null })
              }
            />
            <input
              name="maxPrince"
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
              placeholder="Min Floor Size (Sq Ft)"
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
        {/* )} */}
      </div>
      <ul className={styles.apartmentList}>
        {filteredApartments.map((apartment) => {
          return (
            <ApartmentCard
              apartment={apartment}
              key={new Date(apartment.dateAdded).getTime()}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ApartmentList;
