import { UserRoles } from "../../../types"
import { getRoleFromHeader } from "../../../utils/apiUtils"
import firebaseAdmin from 'firebase-admin'


const handler = async (req, res) => {
  try {
    const requestRole = await getRoleFromHeader(req.headers.authorization)

    if (requestRole === UserRoles.ClIENT) {
      return res.status(500).send({ message: 'Must be an Admin or Realtor to delete'})
    }    
    await firebaseAdmin.database().ref(`apartments/${req.body.uid}`).remove()

    res.status(200).send({ success: true })

  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  
}

export default handler