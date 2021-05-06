import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import styles from "../../styles/forms.module.css";
import { withDbUser } from '../../state/user'
import { WithDbUser } from '../../state/user/context'
import { compose } from 'recompose';
import { makeAuthedPostRequest } from "../../utils/axiosUtils";
import { GmapContext } from '../map/mapLoader'
import util from 'util'

// name, description, floor area size, price per month, number of rooms, valid geolocation coordinates, date added and an associated realtor.

interface CreateApartmentData {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  location: string
  // imageFile: FileList
}

const CreateApartment = (props: WithDbUser) => {

  const { mapsLoaded } = useContext(GmapContext)
  
  const geoencoder = useRef<google.maps.Geocoder>(null)
  const searchBox = useRef<google.maps.places.SearchBox>(null)
  const searchBoxRef = useRef<HTMLInputElement>()
  const { register, handleSubmit } = useForm();
  const authUser = useAuthUser()
  const router = useRouter()

  useEffect(() => {    
    if (mapsLoaded) {
      geoencoder.current = new google.maps.Geocoder()
      searchBox.current = new google.maps.places.SearchBox(searchBoxRef.current)
      // searchBox.current.addListener('places_changed', onPlacesChanged)
    }
  }, [mapsLoaded])

  const onSubmit = async (data: CreateApartmentData) => {
    const locactionObject = { latLng: '', address: '' }
    if (data.location === 'address') {
      const selected = searchBox.current.getPlaces();
      if (selected) {
        const { 0: place } = selected;
        locactionObject.latLng = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`
        locactionObject.address = place.formatted_address
      }
    } else {
      const latLngStr = searchBoxRef.current.value.split(",", 2)
      const location = { location: { lat: parseFloat(latLngStr[0]), lng: parseFloat(latLngStr[1]) }}
      locactionObject.latLng = searchBoxRef.current.value
      
      const addresses = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        (geoencoder.current.geocode(location, (result) => {
          resolve(result)
        }))
      })
      console.log(addresses);
      
      if (addresses.length) {
        locactionObject.address = addresses[0].formatted_address
      }
    }
    
    console.log({
      ...data,
      dateAdded: new Date().toString(),
      isRented: false
    });
    

    await makeAuthedPostRequest(authUser, '/api/apartments/create', {
      ...data,
      dateAdded: new Date().toString(),
      isRented: false,
      ...locactionObject
    })

    router.push('/')    

  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1> Create a listing </h1>
          <div>
          </div>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
              name="name"
              {...register("name")}
              type="text"
              placeholder="Name"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="floorSize"
              {...register("floorSize")}
              type="number"
              placeholder="Floor Size"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="pricePerMonth"
              {...register("pricePerMonth")}
              type="number"
              placeholder="Price Per Month"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="numRooms"
              {...register("numRooms")}
              type="number"
              placeholder="Number of Rooms"
            />
          </div>
          <div className={styles.formGroup}>
            <label>
              Use latitude and longitude: 
              <input
                  name="location"
                  type="radio"
                  value="geolocation"
                  {...register("location")}
              />
            </label>
            <label>
              Use address:
              <input
                name="location"
                type="radio"
                value="address"
                {...register("location")}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <input
              ref={searchBoxRef}
              name="locationVal"
              autoComplete="chrome-off"
              // {...register("locationVal")}
              type="text"
              placeholder="Location"
            />
          </div>
          {/* <div className={styles.formGroup}>
            <input
              name="imageFile"
              {...register("imageFile")}
              type="file"
              placeholder="Load Image"
            />
          </div> */}
          <div className={styles.formGroup}>
            <input
              name="realtor"
              {...register("realtor")}
              type="text"
              placeholder="Associated Realtor"
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="description"
              {...register("description")}
              placeholder="Description"
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default compose(withAuthUser(), withDbUser)(CreateApartment);
