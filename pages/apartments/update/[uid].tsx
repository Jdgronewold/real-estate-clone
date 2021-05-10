import React from 'react'
import {
  withAuthUser,
  getFirebaseAdmin,
  AuthAction,
} from 'next-firebase-auth'
import Layout from '../../../components/layout'
import UpdateApartment from '../../../components/apartments/updateApartment'
import { parseApartments } from '../../../utils/parseApartments'
import { Apartment } from '../../../types'

const UpdateApt: React.FC<{ apartment: Apartment}> = ({ apartment }) => (
  <Layout>
    <UpdateApartment apartment={apartment}/>
  </Layout>
)

export async function getStaticPaths() {
  const db = getFirebaseAdmin().database();
  const apartmentsObject = await (
    await db.ref(`apartments`).once("value")
  ).val();
  const apartments = parseApartments(apartmentsObject, false);

  return {
    paths: apartments.map((apt) => ({ params: { uid: apt.uid } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apartment = await (
    await getFirebaseAdmin()
      .database()
      .ref(`apartments/${params.uid}`)
      .once("value")
  ).val();

  return {
    props: { apartment: { ...apartment, uid: params.uid } },
    revalidate: 1,
  };
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(UpdateApt)