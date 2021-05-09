import React from 'react'
import { AuthAction, getFirebaseAdmin, withAuthUser, useAuthUser } from 'next-firebase-auth'
import { User, UserRoles } from '../../../types';
import Layout from '../../../components/layout';
import AdminEditUser from '../../../components/user/adminEdit';
import router from 'next/router'

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

export default withAuthUser({ whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN })(EditUser)