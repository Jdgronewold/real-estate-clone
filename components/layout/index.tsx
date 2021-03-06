import React from 'react'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import styles from './layout.module.css'
import Header from '../Header'

const Loader = () => <div>Loading...</div>


const Layout: React.FC = (props) => {
  const AuthUser = useAuthUser()

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      </div>
      { props.children}
    </div>
  )

}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: Loader
})(Layout)