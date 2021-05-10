import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import styles from "../../styles/forms.module.css";
import { makeAuthedPutRequest } from "../../utils/axiosUtils";
import { GmapContext } from '../map/mapLoader'
import { Apartment, User, UserRoles } from "../../types";
import app from 'firebase/app'
import axios from 'axios'


// name, description, floor area size, price per month, number of rooms, valid geolocation coordinates, date added and an associated realtor.

interface UpdateApartmentData {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  location: string
  imageFile: FileList,
  isRented: boolean,
  address: string,
  latLng: string,
}

const UpdateApartment: React.FC<{ apartment: Apartment}> = ({ apartment }) => {

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

  const onDelete = async () => {
    const token = await authUser.getIdToken()
    await axios({
      url: '/api/apartments/delete',
      method: 'DELETE',
      headers: { Authorization: token },
      data: { uid : apartment.uid}
    })
    router.push("/")
  }

  const onSubmit = async (data: UpdateApartmentData) => {
    console.log(data);
    
    const locationObject = { latLng: apartment.latLng, address: apartment.address }
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
    
    const finalObject = {...apartment, ...data, ...locationObject }
    console.log(finalObject);
    
    
    Object.keys(finalObject).forEach((key) => {
      if (key !== 'imageFile' && finalObject[key]) {        
        form.append(key, finalObject[key])
      } else if (key === "isRented") {
        form.append(key, finalObject[key].toString())
      }
    })
    if (data.imageFile.length) {
      form.append('imageFile', data.imageFile[0])
    }
    
    
    try {
      await makeAuthedPutRequest(authUser, '/api/apartments/update', form)
      router.push("/")
    } catch (e) {
      console.log(e.response.data)
    }

  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1> Update Listing </h1>
        </div>
        <div className={styles.formGroup}>
          <button onClick={onDelete}>
            Delete Listing
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>
            Has been rented:
            <input
              name="isRented"
              {...register("isRented")}
              type="checkbox"
              defaultChecked={apartment.isRented}
              placeholder="Associated Realtor"
            />
          </label>
          </div>
          <div className={styles.formGroup}>
            <input
              name="name"
              {...register("name", { required: true })}
              type="text"
              defaultValue={apartment.name}
              placeholder="Name"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="floorSize"
              {...register("floorSize", { required: true })}
              type="number"
              defaultValue={apartment.floorSize}
              placeholder="Floor Size"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="pricePerMonth"
              {...register("pricePerMonth", { required: true })}
              type="number"
              defaultValue={apartment.pricePerMonth}
              placeholder="Price Per Month"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="numRooms"
              defaultValue={apartment.numRooms}
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
                  checked={apartment.location === 'gelocation'}
                  {...register("location")}
              />
            </label>
            <label>
              Use address:
              <input
                name="location"
                type="radio"
                value="address"
                checked={apartment.location === 'address'}
                {...register("location")}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <input
              ref={searchBoxRef}
              name="locationVal"
              defaultValue={apartment.location === 'address' ? apartment.address : apartment.latLng}
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
                  return <option value={value} selected={value === apartment.realtor}>{value}</option>
                })
              }
            </select>
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="description"
              {...register("description", { required: true })}
              defaultValue={apartment.description}
              placeholder="Description"
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuthUser<{ apartment: Apartment}>()(UpdateApartment);
