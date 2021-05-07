import { RegisterData } from "../../types";
import firebaseAdmin from 'firebase-admin'

const handler = async (req, res) => {
  try {
    const {
      email,
      passwordOne,
      firstName,
      lastName,
      role,
    } = req.body as RegisterData;
    
    const userRecord = await firebaseAdmin.auth().createUser({email, password: passwordOne})
    await firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, { role });
    await firebaseAdmin.database().ref(`users/${userRecord.uid}`).set({
      firstName,
      lastName,
      email,
      role,
      likedApartments: []
    })

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    
    return res.status(500).send(e.message);
  }
};

export default handler;
