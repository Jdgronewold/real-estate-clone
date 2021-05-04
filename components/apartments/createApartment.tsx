import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import styles from "../../styles/forms.module.css";
import { withDbUser } from '../../state/user'
import { WithDbUser } from '../../state/user/context'
import { compose } from 'recompose';
import { makeAuthedPostRequest } from "../../utils/addAuth";

// name, description, floor area size, price per month, number of rooms, valid geolocation coordinates, date added and an associated realtor.

interface CreateApartmentData {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  // imageFile: FileList
}

const CreateApartment = (props: WithDbUser) => {
  
  const { register, handleSubmit } = useForm();
  const authUser = useAuthUser()
  const router = useRouter()

  const onSubmit = async (data: CreateApartmentData) => {

    await makeAuthedPostRequest(authUser, '/api/apartment/create', {
      ...data,
      dateAdded: new Date().toString()
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
