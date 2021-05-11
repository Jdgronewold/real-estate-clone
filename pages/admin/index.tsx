import React from 'react'
import Layout from '../../components/layout'
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import firebaseAdmin from 'firebase-admin'
import { UserRoles } from '../../types'
import styles from './admin.module.css'
import Link from 'next/link'



const AdminPage: React.FC<{ users: { uid: string, email: string}[]}> = ({ users}) => {

  return (
    <Layout>
      <div className={styles.admin}>
        <h1>Admin</h1>
        <div>
          <h4> Users: </h4>
          <div>
          <div className={styles.adminUser}>
              <Link href="/admin/create-user"><span className={styles.adminUserDisplay}>Create User</span></Link>
            </div>
            {
              users.map((user) => {
                return (
                  <div className={styles.adminUser} key={user.uid}>
                    <Link href={`/admin/edit/${user.uid}`}><span className={styles.adminUserDisplay} data-cy={user.email}>{user.email}</span></Link>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({ whenUnauthed: AuthAction.REDIRECT_TO_LOGIN})(async ({ AuthUser, req }) => {

  if (AuthUser.claims.role !== UserRoles.ADMIN) {
    return {
      redirect: {
        permanent: true,
        destination: "/login"
      }
    }
  }
  const { users } = await firebaseAdmin.auth().listUsers()
  return {
    props: { users: users.map((userRecord) => ({ uid: userRecord.uid, email: userRecord.email })) }
  }


  
})

export default AdminPage