import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import Map from '../components/map'
import { ApartmentList } from '../components/apartments'

const MyLoader = () => <div>Loading...</div>

const Home = () => {
  const AuthUser = useAuthUser()

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Toptal Real Estate</title>
          
        </Head>
          <Map />
          <ApartmentList />
      </div>
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: MyLoader,
})(Home)
