import React from 'react'
import Layout from '../../components/layout'
import { AdminCreateUser } from '../../components/user/adminCreate'
import { withAuthUser, AuthAction, useAuthUser } from 'next-firebase-auth'
import { UserRoles } from '../../types'
import router from 'next/router'


const createUser = () => {

  return (
    <Layout>
      <AdminCreateUser />
    </Layout>
  )
}


export default withAuthUser({ whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN })(createUser)