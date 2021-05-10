import { verifyIdToken } from 'next-firebase-auth'
import firebaseAdmin from 'firebase-admin'
import { Apartment, UserRoles } from '../../../types';
import formidable from 'formidable'
var cloudinary = require('cloudinary').v2;
import {UploadApiResponse } from 'cloudinary'


const cloudConfig = {
  cloudName: 'toptalRealEstate',
  apiKey: process.env.CLOUDINARY_API,
  apiSecret: process.env.CLOUDINARY_SECRET
}
cloudinary.config(cloudConfig)


export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req, res) => {
  try {
    const user = await verifyIdToken(req.headers.authorization)
    const userRecord = await firebaseAdmin.auth().getUser(user.id)
    const { role } = userRecord.customClaims

    if ( role === UserRoles.ADMIN || role === UserRoles.REALTOR) {
      const form = new formidable.IncomingForm();
      const data = await new Promise<Apartment>((resolve, reject) => {
        (form.parse(req, async (err, fields, files) => {
          const fieldData = fields as unknown as Apartment
          const imageFile = files["imageFile"] as formidable.File
          if (imageFile) {
            try {            
              const response: UploadApiResponse = await cloudinary.uploader.upload(imageFile.path)
              resolve({ ...fieldData, imageUrl: response.secure_url })
            } catch (e) {
              return res.status(500).send({ error: "Picture upload failed" })
            }
          } else {
            resolve({ ...fieldData }) // leave off imageUrl becuase it is either already there or still empty
          }
          
        }))
      })      

    const isRented = data.isRented as unknown as string

     await firebaseAdmin.database().ref(`apartments/${data.uid}`).set({
        ...data,
        isRented: (isRented === 'true')
      })
      return res.status(200).send({ success: true })
      
    } else {
      return res.status(500).json({ error: "User must be a realtor or admin" })
    }

    
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

export default handler