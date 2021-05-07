import React from "react";
import { getFirebaseAdmin } from "next-firebase-auth";
import { parseApartments } from "../../utils/parseApartments";
import { Apartment } from "../../types";
import Image from "next/image";
import Link from "next/link";
import styles from "./apartment.pages.module.css";
import Layout from "../../components/layout";

const ApartmentPage: React.FC<{ apartment: Apartment }> = ({ apartment }) => {
  return (
    <Layout>
      {apartment && (
        <div className={styles.apartmentDisplay}>
          <Link href="/"><div className={styles.apartmentDisplayBack}>{'Back to apartment list'}</div></Link>
          <div className={styles.apartmentImage}>
            <Image
              className={styles.apartmentDisplayImage}
              src={
                apartment.imageUrl ? apartment.imageUrl : "/generic_house.png"
              }
              alt="House picture"
              layout="fill"
              objectFit="fill"
            />
          </div>
          <div className={styles.apartmentDisplayBody}>
            <div>{apartment.address}</div>
            <div className={styles.apartmentDisplayTitle}>
              {apartment.name}
            </div>

            <div className={styles.apartmentDisplaySubHeader}>
              <div>{`$${apartment.pricePerMonth}`}</div>
              <div>{apartment.numRooms} Room(s)</div>
              <div>{apartment.floorSize} Sq. Ft.</div>
            </div>
            <div className={styles.apartmentDisplayDescription}>{apartment.description}</div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export async function getStaticPaths() {
  const db = getFirebaseAdmin().database();
  const apartmentsObject = await (
    await db.ref(`apartments`).once("value")
  ).val();
  const apartments = parseApartments(apartmentsObject);

  return {
    paths: apartments.map((apt) => ({ params: { uid: apt.uid } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apartment = await (
    await getFirebaseAdmin()
      .database()
      .ref(`apartments/${params.uid}`)
      .once("value")
  ).val();

  return {
    props: { apartment },
    revalidate: 10,
  };
}

export default ApartmentPage;
