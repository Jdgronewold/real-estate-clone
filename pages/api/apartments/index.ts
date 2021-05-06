import { verifyIdToken } from "next-firebase-auth";
import firebaseAdmin from "firebase-admin";
import { UserRoles } from '../../../types';
import { parseApartments } from "../../../utils/parseApartments";

const handler = async (req, res) => {
  try {
    const user = await verifyIdToken(req.headers.authorization);
    const userRecord = await firebaseAdmin.auth().getUser(user.id);
    const { role } = userRecord.customClaims;

    const apartmentsObject = await firebaseAdmin
      .database()
      .ref("apartments")
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      });

    if (!apartmentsObject) {
      return res
      .status(200)
      .json({
        apartments: []
      })
    }
    const apartments = parseApartments(apartmentsObject)

    if (role === UserRoles.ADMIN || role === UserRoles.REALTOR) {
      return res.status(200).json({ apartments });
    } else if (role === UserRoles.ClIENT) {
      return res
        .status(200)
        .json({
          apartments: apartments.filter((apartment) => !apartment.isRented),
        });
    } else {
      return res
        .status(500)
        .json({ error: "User must have a role to see apartments" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error." });
  }
};

export default handler;
