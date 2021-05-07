import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import styles from '../../styles/forms.module.css'
import Link from 'next/link'
import { RegisterData, UserRoles } from '../../types'
import axios, { AxiosError } from 'axios'
import app from 'firebase/app'

export default function Signup() {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState<string>('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const onSubmit = async (data: RegisterData) => {   
    try {
      setIsCreatingUser(true)
      await axios.post('/api/register', { ...data })
      await app.auth().signInWithEmailAndPassword(data.email, data.passwordOne)
    } catch (error) {
      setError(error.response.data)
      setIsCreatingUser(false)
    }
    
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
          <div className={styles.formGroupError}>
            <span>{error}</span>
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              { isCreatingUser ? 'Creating user...' : 'Sign Up' }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
