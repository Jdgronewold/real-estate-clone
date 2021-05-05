import React from 'react'
import { useForm } from "react-hook-form"
import styles from '../../styles/forms.module.css'
import app from 'firebase/app'
import Link from 'next/link'

interface LoginData {
  email: string,
  password: string
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: LoginData) => {

    const authUser = await app.auth().signInWithEmailAndPassword(data.email, data.password)
    
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}> 
        <div className={styles.formHeaderWithSub}>
          <h1> Login </h1>
          <div>
            <span>Need to create an account? </span><Link href="/register">Click here</Link>
          </div>
        </div>
        <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
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
              name="password"
              {...register('password')}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">
              Log in
            </button>
          </div>

          {errors && <p>{errors.message}</p>}
        </form>
      </div>
    </div>
  )
}
