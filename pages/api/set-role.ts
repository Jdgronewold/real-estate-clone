import { verifyIdToken } from 'next-firebase-auth'
import firebaseAdmin from 'firebase-admin'

const handler = async (req, res) => {
  try {
    const { role } = req.body
    const user = await verifyIdToken(req.headers.authorization)
    await firebaseAdmin.auth().setCustomUserClaims(user.id, { role });
    return res.status(200).json({ success: true })

  } catch (e) {   
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  
}

export default handler