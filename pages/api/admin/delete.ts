import { UserRoles } from "../../../types"
import { getRoleFromHeader } from "../../../utils/apiUtils"
import firebaseAdmin from 'firebase-admin'


const handler = async (req, res) => {
  try {
    const requestRole = await getRoleFromHeader(req.headers.authorization)

    if (requestRole !== UserRoles.ADMIN) {
      return res.status(500).send({ message: 'Must be an admin'})
    }    
    await firebaseAdmin.auth().deleteUser(req.body.uid)
    await firebaseAdmin.database().ref(`users/${req.body.uid}`).remove()

    res.status(200).send({ success: true })

  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  
}

export default handler