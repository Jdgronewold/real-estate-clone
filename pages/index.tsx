import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";
import Map from "../components/map";
import { ApartmentList } from "../components/apartments";
import { makeAuthedGetRequest } from "../utils/axiosUtils";
import getAbsoluteURL from "../utils/getAbsoluteUrl";
import { Apartment } from "../types";
import { useApartments } from "../state/apartments/useApartments";

const MyLoader = () => <div>Loading...</div>;

const Home: React.FC<{ initialApartments: Apartment[] }> = ({ initialApartments }) => {
  const AuthUser = useAuthUser();
  const apartments = useApartments(initialApartments)  

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Toptal Real Estate</title>
        </Head>
        <Map initialApartments={apartments}/>
        { apartments && <ApartmentList apartments={apartments} /> }
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  const url = getAbsoluteURL("/api/apartments", req);
  const response = await makeAuthedGetRequest(AuthUser, url)  
  return {
    props: {
      initialApartments: response.data.apartments,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: MyLoader,
})(Home);
