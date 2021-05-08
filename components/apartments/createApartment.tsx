import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import styles from "../../styles/forms.module.css";
import { makeAuthedPostRequest } from "../../utils/axiosUtils";
import { GmapContext } from '../map/mapLoader'
import app from 'firebase/app'
import { User, UserRoles } from "../../types";

// name, description, floor area size, price per month, number of rooms, valid geolocation coordinates, date added and an associated realtor.

interface CreateApartmentData {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  location: string
  imageFile: FileList
}

const CreateApartment = () => {

  const { mapsLoaded } = useContext(GmapContext)
  
  const geoencoder = useRef<google.maps.Geocoder>(null)
  const searchBox = useRef<google.maps.places.SearchBox>(null)
  const searchBoxRef = useRef<HTMLInputElement>()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const authUser = useAuthUser()
  const router = useRouter()
  const [realtors, setRealtors] = useState<User[]>([])  

  useEffect(() => {    
    if (mapsLoaded) {
      geoencoder.current = new google.maps.Geocoder()
      searchBox.current = new google.maps.places.SearchBox(searchBoxRef.current)
    }
  }, [mapsLoaded])

  useEffect(() => {
    app.database().ref('users').orderByChild("role").equalTo(UserRoles.REALTOR).once("value", (snapshot) => {
      const realtors = snapshot.val()
      setRealtors(Object.keys(realtors).map((key) => realtors[key]))
    })
  }, [])

  const onSubmit = async (data: CreateApartmentData) => {
    const locationObject = { latLng: '', address: '' }
    if (data.location === 'address') {
      const selected = searchBox.current.getPlaces();
      if (selected) {
        const { 0: place } = selected;
        locationObject.latLng = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`
        locationObject.address = place.formatted_address
      }
    } else {
      const latLngStr = searchBoxRef.current.value.split(",", 2)
      const location = { location: { lat: parseFloat(latLngStr[0]), lng: parseFloat(latLngStr[1]) }}
      locationObject.latLng = searchBoxRef.current.value
      
      const addresses = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        (geoencoder.current.geocode(location, (result) => {
          resolve(result)
        }))
      })      
      if (addresses.length) {
        locationObject.address = addresses[0].formatted_address
      }
    }

    const form = new FormData()
    Object.keys({...data, ...locationObject, isRented: false }).forEach((key) => {
      if (key !== 'imageFile') {
        form.append(key, data[key] || locationObject[key])
      }
    })
    form.append('imageFile', data.imageFile[0])
    
    try {
      await makeAuthedPostRequest(authUser, '/api/apartments/create', form)
      router.push("/")
    } catch (e) {
      console.log(e.response.data)
    }

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
              {...register("name", { required: true })}
              type="text"
              placeholder="Name"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="floorSize"
              {...register("floorSize", { required: true })}
              type="number"
              placeholder="Floor Size"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="pricePerMonth"
              {...register("pricePerMonth", { required: true })}
              type="number"
              placeholder="Price Per Month"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="numRooms"
              {...register("numRooms", { required: true })}
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
                checked
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
          <div className={styles.formGroup}>
            <input
              name="imageFile"
              {...register("imageFile")}
              type="file"
              placeholder="Load Image"
            />
          </div>
          <div className={styles.formGroup}>
            <select {...register("realtor")}>
               <option disabled selected>Associated Realtor</option>
              {
                realtors.map((realtor) => {
                  const value = `${realtor.firstName} ${realtor.lastName}`
                  return <option value={value}>{value}</option>
                })
              }
            </select>
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="description"
              {...register("description", { required: true })}
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

export default withAuthUser()(CreateApartment);
