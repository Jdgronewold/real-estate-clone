import React, { useState } from "react";
import { Apartment } from "../../types";
import styles from "./apartments.module.css";
import { ApartmentCard } from "./apartmentCard";

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
        <div className={styles.apartmentFilterOpacity} style={{ opacity: showFilters ? 1 : 0 }}>
          <div className={styles.apartmentFilter}>
            <input
              name="minPrince"
              value={price.min}
              placeholder="Min Price"
              type="number"
              onChange={(event) =>
                setPrice({ ...price, min: parseInt(event.target.value) })
              }
            />
            <input
              name="maxPrince"
              value={price.max}
              placeholder="Max Price"
              type="number"
              onChange={(event) =>
                setPrice({ ...price, max: parseInt(event.target.value) })
              }
            />
          </div>
          <div className={styles.apartmentFilter}>
            <input
              name="minFloorSize"
              value={floorSize.min}
              placeholder="Min Floor Size (Sq Ft)"
              type="number"
              onChange={(event) =>
                setFloorSize({
                  ...floorSize,
                  min: parseInt(event.target.value),
                })
              }
            />
            <input
              name="maxFloorSize"
              value={floorSize.max}
              placeholder="Max Price"
              type="number"
              onChange={(event) =>
                setFloorSize({
                  ...floorSize,
                  max: parseInt(event.target.value),
                })
              }
            />
          </div>
          <div className={styles.apartmentFilter}>
            <input
              name="minNumRooms"
              value={price.min}
              placeholder="Min Number of Rooms"
              type="number"
              onChange={(event) =>
                setNumRooms({
                  ...numRooms,
                  min: parseInt(event.target.value),
                })
              }
            />
            <input
              name="maxNumRooms"
              value={price.max}
              type="number"
              placeholder="Max Number of Rooms"
              onChange={(event) =>
                setNumRooms({
                  ...numRooms,
                  max: parseInt(event.target.value),
                })
              }
            />
          </div>
        </div>
        {/* )} */}
      </div>
      <ul className={styles.apartmentList}>
        {apartments.map((apartment) => {
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
