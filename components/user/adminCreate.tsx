import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import styles from '../../styles/forms.module.css'
import { RegisterData, UserRoles } from '../../types'
import axios from 'axios'
import { useRouter } from 'next/router'



export const AdminCreateUser: React.FC = () => {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState<string>('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: RegisterData) => {   
    if (data.passwordOne !== data.passwordTwo) {
      setError("Passwords do not match")
      return
    }
    try {
      setIsCreatingUser(true)
      await axios.post('/api/register', { ...data })
      setIsCreatingUser(false)
      router.push("/admin")
    } catch (error) {
      setError(error.response.data)
      setIsCreatingUser(false)
    }
    
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}> 
        <div className={styles.formHeader}>
          <h1> Create User </h1>
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
              { isCreatingUser ? 'Creating user...' : 'Create User' }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}