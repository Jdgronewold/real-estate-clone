import { UserRoles } from "../../../types"
import { getRoleFromHeader } from "../../../utils/apiUtils"
import firebaseAdmin from 'firebase-admin'


const handler = async (req, res) => {
  try {
    const requestRole = await getRoleFromHeader(req.headers.authorization)
    if (requestRole !== UserRoles.ADMIN) {
      return res.status(500).send({ message: 'Not authorized to update a user' })
    }

    const { email, firstName, lastName, passwordOne, role, uid } = req.body

    const newAuthUser = {
      email
    }

    if (passwordOne.length) {
      newAuthUser['password'] = passwordOne
    }

    await firebaseAdmin.auth().updateUser(uid, newAuthUser)
    await firebaseAdmin.database().ref(`users/${uid}`).update({
      email, role, firstName, lastName
    })

    res.status(200).send({ success: true})

  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  
}

export default handler