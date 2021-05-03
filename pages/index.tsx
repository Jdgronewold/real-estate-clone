import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Layout from '../components/layout'

const MyLoader = () => <div>Loading...</div>

const Home = () => {
  const AuthUser = useAuthUser()

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Toptal Real Estate</title>
          
        </Head>

        <main className={styles.main}>
          <Header email={AuthUser.email} signOut={AuthUser.signOut} />
        </main>

      </div>
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: MyLoader,
})(Home)
