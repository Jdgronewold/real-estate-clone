import React from 'react'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Login from '../components/login'
import Layout from '../components/layout'
import initAuth from '../utils/initAuth'

initAuth()

const Auth = () => (
  <Layout>
    <Login />
  </Layout>
)

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({ whenAuthed: AuthAction.REDIRECT_TO_APP })(Auth)