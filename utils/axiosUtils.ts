import { AuthUser } from 'next-firebase-auth'
import firebase from 'firebase'
import axios from 'axios'

export const makeAuthedPostRequest = async <T>(user: AuthUser | firebase.User, endpoint: string, body: T) => {
  const token = await user.getIdToken()
  return axios.post(endpoint, body, { headers: { Authorization: token || 'unauthenticated' }})
}

export const makeAuthedGetRequest = async <T>(user: AuthUser | firebase.User, endpoint: string) => {
  const token = await user.getIdToken()
  return axios.get(endpoint, { headers: { Authorization: token || 'unauthenticated' }})
} 