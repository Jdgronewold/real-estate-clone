import React from 'react'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Signup from '../components/signup'
import Layout from '../components/layout'
import initAuth from '../utils/initAuth'

initAuth()

const Register = () => (
  <Layout>
    <Signup />
  </Layout>
)

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({ whenAuthed: AuthAction.REDIRECT_TO_APP })(Register)