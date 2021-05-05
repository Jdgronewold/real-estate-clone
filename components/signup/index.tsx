import React from 'react'
import { useForm } from "react-hook-form"
import styles from '../../styles/forms.module.css'
import firebase from 'firebase'
import app from 'firebase/app'
import Link from 'next/link'
import { makeAuthedPostRequest } from '../../utils/axiosUtils'
import { UserRoles } from '../../types'

interface RegisterData {
  firstName: string
  lastName: string
  email: string,
  passwordOne: string
  passwordTwo: string
  role: UserRoles
}

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: RegisterData) => {
    const { firstName, lastName, email, role} = data
    
    const { user } = await app.auth().createUserWithEmailAndPassword(data.email, data.passwordOne)
    await makeAuthedPostRequest(user, '/api/set-role', { role })
    await firebase.database().ref(`users/${user.uid}`).set({
      firstName,
      lastName,
      email,
      role,
      likedApartments: []
    })
    
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}> 
        <div className={styles.formHeaderWithSub}>
          <h1> Register </h1>
          <div>
            <span>Already have an account? </span><Link href="/login">Sign in</Link>
          </div>
        </div>
        <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
                name="firstName"
                {...register('firstName')}
                type="text"
                placeholder="First Name"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="lastName"
              {...register('lastName')}
              type="text"
              placeholder="Last Name"
            />
          </div>
      
          <div className={styles.formGroup}>
            <input
              name="email"
              {...register('email')}
              type="text"
              placeholder="Email Address"
            />
          </div>
      
          <div className={styles.formGroup}>
            <input
              name="passwordOne"
              {...register('passwordOne')}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="passwordTwo"
              {...register('passwordTwo')}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
      
          <div className={styles.formGroup}>
            <select {...register("role")}>
              <option value={UserRoles.ClIENT}>Client</option>
              <option value={UserRoles.REALTOR}>Realtor</option>
              <option value={UserRoles.ADMIN}>Admin</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              Sign Up
            </button>
          </div>

          {errors && <p>{errors.message}</p>}
        </form>
      </div>
    </div>
  )
}
