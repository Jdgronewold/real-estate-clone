import { verifyIdToken } from 'next-firebase-auth'
import firebaseAdmin from 'firebase-admin'
import { UserRoles } from '../types'

export const getRoleFromHeader = async (authToken: string): Promise<UserRoles> => {
  const user = await verifyIdToken(authToken)
  const userRecord = await firebaseAdmin.auth().getUser(user.id)
  const { role } = userRecord.customClaims
  return role
}