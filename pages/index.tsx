import { useState, useMemo } from 'react'
import {
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
import { ApartmentFilter } from '../components/filter'

const MyLoader = () => <div>Loading...</div>;

const Home: React.FC<{ initialApartments: Apartment[] }> = ({ initialApartments }) => {
  const apartments = useApartments(initialApartments)  
  const [floorSize, setFloorSize] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });
  const [numRooms, setNumRooms] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });
  const [price, setPrice] = useState<{ min: number; max: number }>({
    min: null,
    max: null,
  });

  const filteredApartments = useMemo(() => {
    const apartmentsFilteredByPrice = apartments.filter((apt) => {
      let filtered = true;
      if (price.min !== null) {
        filtered = apt.pricePerMonth > price.min;
      }
      if (price.max !== null) {
        filtered = apt.pricePerMonth < price.max;
      }
      return filtered;
    });

    const apartmentsFilteredByRooms = apartmentsFilteredByPrice.filter(
      (apt) => {
        let filtered = true;

        if (numRooms.min !== null) {
          filtered = apt.numRooms > numRooms.min;
        }
        if (numRooms.max !== null) {
          filtered = apt.numRooms < numRooms.max;
        }
        return filtered;
      }
    );

    const apartmentsFilteredBySize = apartmentsFilteredByRooms.filter((apt) => {
      let filtered = true;
      if (floorSize.min !== null) {
        filtered = apt.floorSize > floorSize.min;
      }
      if (floorSize.max !== null) {
        filtered = apt.floorSize < floorSize.max;
      }
      return filtered;
    });
    return apartmentsFilteredBySize;
  }, [apartments, floorSize, price, numRooms]);

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Toptal Real Estate</title>
        </Head>
        <Map apartments={filteredApartments}/>
        <div className={styles.apartments}>
          <ApartmentFilter
            price={price}
            floorSize={floorSize}
            numRooms={numRooms}
            setPrice={setPrice}
            setNumRooms={setNumRooms}
            setFloorSize={setFloorSize}
          />
          { filteredApartments && <ApartmentList apartments={filteredApartments} /> }
        </div>
        
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
