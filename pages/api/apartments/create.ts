import { verifyIdToken } from 'next-firebase-auth'
import firebaseAdmin from 'firebase-admin'
import { UserRoles } from '../../../types';

const handler = async (req, res) => {
  try {
    const user = await verifyIdToken(req.headers.authorization)
    const userRecord = await firebaseAdmin.auth().getUser(user.id)
    const { role } = userRecord.customClaims
    
    if ( role === UserRoles.ADMIN || role === UserRoles.REALTOR) {
      const newApartmentRef = await firebaseAdmin.database().ref('apartments').push({
        ...req.body
      })
    
      return res.status(200).json({ apartmentId: newApartmentRef.key })
    } else {
      return res.status(500).json({ error: "User must be a realtor or admin" })
    }

    
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
}

export default handler