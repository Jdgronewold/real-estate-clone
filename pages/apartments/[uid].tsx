import React from "react";
import { getFirebaseAdmin, withAuthUser, useAuthUser, AuthAction } from "next-firebase-auth";
import { parseApartments } from "../../utils/parseApartments";
import { Apartment, UserRoles } from "../../types";
import Image from "next/image";
import Link from "next/link";
import styles from "./apartment.pages.module.css";
import Layout from "../../components/layout";

const ApartmentPage: React.FC<{ apartment: Apartment }> = ({ apartment }) => {
  const authUser =  useAuthUser()  
  const dateString = new Date(parseInt(apartment.dateAdded as unknown as string)).toDateString()
  return (
    <Layout>
      {apartment && (
        <div className={styles.apartmentDisplay}>
          <div className={styles.apartmentDisplayHeader}>
          <Link href="/"><div>{'Back to apartment list'}</div></Link>
            {
              (authUser.claims["role"] === UserRoles.ADMIN || authUser.claims["role"] === UserRoles.REALTOR) &&
              <Link href={`/apartments/update/${apartment.uid}`}>
                <div data-cy="edit-apartment">
                  Edit Listing
                </div>
              </Link>
            }
          </div>
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
            <div className={styles.apartmentDisplayBodyHeader}><span>{apartment.address}</span> <span>Date Added: {dateString}</span></div>
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
  const apartments = parseApartments(apartmentsObject, false);

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
    props: { apartment: { ...apartment, uid: params.uid } },
    revalidate: 1,
  };
}

export default withAuthUser({ whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN})(ApartmentPage);
