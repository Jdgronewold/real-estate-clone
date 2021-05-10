import React from 'react'
import Layout from '../../components/layout'
import { AdminCreateUser } from '../../components/user/adminCreate'
import { withAuthUser, AuthAction } from 'next-firebase-auth'


const createUser = () => {

  return (
    <Layout>
      <AdminCreateUser />
    </Layout>
  )
}


export default withAuthUser({ whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN })(createUser)