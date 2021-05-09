import React from 'react'
import firebaseAdmin from 'firebase-admin'
import { getFirebaseAdmin } from 'next-firebase-auth'
import { User } from '../../../types';
import Layout from '../../../components/layout';
import { AdminEditUser } from '../../../components/user/adminEdit';

const EditUser: React.FC<{user: User}> = ({ user }) => {
  return (
    <Layout>
      <AdminEditUser user={user} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const usersObject = await (await getFirebaseAdmin().database().ref('users').once("value")).val()
  
  return {
    paths: Object.keys(usersObject).map((key) => ({ params: { uid: key } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const user = await (
    await getFirebaseAdmin()
      .database()
      .ref(`users/${params.uid}`)
      .once("value")
  ).val();

  return {
    props: { user: { ...user, uid: params.uid } },
    revalidate: 1,
  };
}

export default EditUser