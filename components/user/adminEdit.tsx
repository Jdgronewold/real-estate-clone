import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { RegisterData, User, UserRoles } from '../../types'
import { useRouter } from 'next/router'
import styles from '../../styles/forms.module.css'
import { makeAuthedPostRequest } from '../../utils/axiosUtils'
import { withAuthUser, useAuthUser } from 'next-firebase-auth'
import axios from 'axios'



const AdminEditUser: React.FC<{user: User}> = ({ user }) => {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState<string>('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const AuthUser = useAuthUser()
  const router = useRouter()

  const deleteUser = async () => {
    const token = await AuthUser.getIdToken()
    await axios({
      url: '/api/admin/delete',
      method: 'DELETE',
      headers: { Authorization: token },
      data: { uid : user.uid}
    })
    router.push("/admin")
  }

  const onSubmit = async (data: RegisterData) => {   
    try {
      setIsCreatingUser(true)      
      await makeAuthedPostRequest(AuthUser, '/api/admin/update', { ...data, uid: user.uid })
      setIsCreatingUser(false)
      router.push("/")
    } catch (error) {
      setError(error.response.data)
      setIsCreatingUser(false)
    }
    
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}> 
        <div className={styles.formHeader}>
          <h1> Edit User </h1>
        </div>
        <div className={styles.formGroup}>
          <button onClick={deleteUser}>
            Delete User
          </button>
        </div>
        <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
                name="firstName"
                {...register('firstName')}
                type="text"
                placeholder="First Name"
                defaultValue={user.firstName}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              name="lastName"
              {...register('lastName')}
              type="text"
              placeholder="Last Name"
              defaultValue={user.lastName}
            />
          </div>
      
          <div className={styles.formGroup}>
            <input
              name="email"
              {...register('email')}
              type="text"
              placeholder="Email Address"
              defaultValue={user.email}
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
              <option value={UserRoles.ClIENT} selected={user.role === UserRoles.ClIENT}>Client</option>
              <option value={UserRoles.REALTOR} selected={user.role === UserRoles.REALTOR}>Realtor</option>
              <option value={UserRoles.ADMIN} selected={user.role === UserRoles.ADMIN}>Admin</option>
            </select>
          </div>
          <div className={styles.formGroupError}>
            <span>{error}</span>
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              { isCreatingUser ? 'Editing user...' : 'Edit User' }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withAuthUser<{user: User}>()(AdminEditUser)